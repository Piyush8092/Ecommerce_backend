let Subscription = require("../../models/subscriptionModle");

const deleteSubscription = async (req, res) => {
  try {
    let id = req.params.id;

    const result = await Subscription.findByIdAndDelete(id);
    res.status(200).json({
      message: "Subscription deleted successfully",
      data: result,
      success: true,
      error: false,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = { deleteSubscription };
