const DailyRoster = require("../../models/dining/DailyRoster");
const mongoose = require("mongoose")
const upsertRoster = async (req, res, next) => {
  try {
    const { dates, items, notes } = req.body;

    if (!dates?.length || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Dates and items are required",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    maxDate.setHours(0, 0, 0, 0);

    const results = [];

    for (const d of dates) {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);

      if (date < today || date > maxDate) continue;

      const formattedItems = items.map((i) => ({
        id: new mongoose.Types.ObjectId(i.id),
        quantity: i.quantity,
      }));

      const existingRoster = await DailyRoster.findOne({ date });

      if (existingRoster) {
        existingRoster.items = formattedItems;
        existingRoster.notes = notes || "";
        await existingRoster.save();
        results.push(existingRoster);
      } else {
        const roster = await DailyRoster.create({
          date,
          items: formattedItems,
          notes: notes || "",
          createdBy: req.user?._id,
        });

        results.push(roster);
      }
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};


const getRosterByDate = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date required" });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const roster = await DailyRoster.findOne({ date: selectedDate })
      .populate({
        path: "items.id",
        select: "name price images category",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .lean();

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
