const DeliveryAddress = require("../../models/deliveryAddressModel");

const getAllDeliveryAdderss = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const user = req.user; // contains role + id

    let filter = {};

    // If NOT admin, filter by userId
    if (user.role !== "ADMIN") {
      filter.userId = user._id;
    }

    const deliveryAddress = await DeliveryAddress.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    // Get total count
    const total = await DeliveryAddress.countDocuments(filter);

    res.json({
      message: "Delivery address fetched successfully",
      status: 200,
      data: deliveryAddress,
      total,
      totalPages: Math.ceil(total / limitNum),
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

module.exports = { getAllDeliveryAdderss };
