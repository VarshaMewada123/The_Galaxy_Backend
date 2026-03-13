const Review = require("../models/reviewModel");

exports.createReview = async (req, res, next) => {
  try {
    const { order, foodRating, serviceRating, overallRating, comment } =
      req.body;

    if (!order || !foodRating || !serviceRating || !overallRating) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const existingReview = await Review.findOne({ order });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted for this order",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      order,
      foodRating,
      serviceRating,
      overallRating,
      comment,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReviewByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const review = await Review.findOne({
      order: orderId,
      user: req.user.id,
    });

    res.json({
      success: true,
      data: review || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
