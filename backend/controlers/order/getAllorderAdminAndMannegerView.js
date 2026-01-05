let Order = require("../../models/orderModel");

const getAllorderAdminAndMannegerView = async (req, res) => {
  try {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let skip = (page - 1) * limit;
    let total = await Order.countDocuments();
    let totalPages = Math.ceil(total / limit);

    if (req.user.role !== "ADMIN" && req.user.role !== "MANAGER") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await Order.find()
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId")
      .populate("productId", "name price image length breadth height weight");
    res.json({
      message: "Order fetched successfully",
      status: 200,
      data: order,
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

module.exports = { getAllorderAdminAndMannegerView };
