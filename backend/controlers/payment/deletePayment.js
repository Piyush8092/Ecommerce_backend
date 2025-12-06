let Payment = require("../../models/paymentModel");

const deletePayment = async (req, res) => {
  try {
    let id = req.params.id;

    // Find the payment
    const payment = await Payment.findById(id);
    if (!payment) {
      return res
        .status(404)
        .json({
          message: "Payment not found",
          status: 404,
          success: false,
          error: true,
        });
    }

    // Check authorization - only ADMIN or the user who made the payment can delete
    if (
      req.user.role !== "ADMIN" &&
      req.user._id.toString() !== payment.userId.toString()
    ) {
      return res
        .status(401)
        .json({
          message: "Unauthorized",
          status: 401,
          success: false,
          error: true,
        });
    }

    // Delete payment
    await Payment.findByIdAndDelete(id);

    res.json({
      message: "Payment deleted successfully",
      status: 200,
      success: true,
      error: false,
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

module.exports = { deletePayment };
