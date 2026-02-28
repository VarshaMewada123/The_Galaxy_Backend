const DailyRoster = require("../../models/dining/DailyRoster");

const upsertRoster = async (req, res, next) => {
  try {
    const { dates, items, notes } = req.body;

    if (!dates?.length || !items?.length) {
      return res.status(400).json({
        message: "Dates and items are required",
      });
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);

    const results = [];

    for (const d of dates) {
      const selectedDate = new Date(d);
      selectedDate.setHours(0,0,0,0);

      if (selectedDate < today)
        return res.status(400).json({ message: "Past dates not allowed" });

      if (selectedDate > maxDate)
        return res.status(400).json({ message: "Only next 6 months allowed" });

      const roster = await DailyRoster.findOneAndUpdate(
        { date: selectedDate },
        {
          items,
          notes,
          createdBy: req.user?._id,
        },
        { upsert: true, new: true }
      );

      results.push(roster);
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
};

const getRosterByDate = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date)
      return res.status(400).json({ message: "Date required" });

    const selectedDate = new Date(date);
    selectedDate.setHours(0,0,0,0);

    const roster = await DailyRoster.findOne({ date: selectedDate })
      .populate({
        path: "items",
        populate: { path: "category", select: "name" },
      });

    res.json({
      success: true,
      data: roster || { items: [] },
    });
  } catch (err) {
    next(err);
  }
};

const getRosterRange = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    const data = await DailyRoster.find({
      date: { $gte: new Date(start), $lte: new Date(end) },
    }).select("date items");

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upsertRoster,
  getRosterByDate,
  getRosterRange,
};