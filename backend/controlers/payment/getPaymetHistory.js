let Payment = require("../../models/paymentModel");

const getPaymentHistory = async (req, res) => {
  try {
    let userId = req.user._id;
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let skip = (page - 1) * limit;
    let total = await Payment.countDocuments({ userId });
    let totalPages = Math.ceil(total / limit);
    const payment = await Payment.find({ userId })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email phone image")
      .populate("orderId");
    res.json({
      message: "Payment fetched successfully",
      status: 200,
      data: payment,
      success: true,
      error: false,
      total,
      totalPages,
    });
  } catch (e) {
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e,
      success: false,
      error: true,
    });
  }
};

module.exports = { getPaymentHistory };
