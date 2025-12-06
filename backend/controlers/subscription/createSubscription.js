let Subscription = require("../../models/subscriptionModle");

const createSubscription = async (req, res) => {
  try {
    let userId = req.user._id;
    let { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Create new subscription
    const newSubscription = new Subscription({
      userId,
      email,
    });

    const savedSubscription = await newSubscription.save();

    res.json({
      message: "Subscription created successfully",
      status: 200,
      data: savedSubscription,
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

module.exports = { createSubscription };
