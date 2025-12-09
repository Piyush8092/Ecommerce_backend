const DeliveryAddress = require("../../models/deliveryAddressModel");

const getQueryDeliveryAddress = async (req, res) => {
  try {
    const { query = "", page = 1, limit = 10 } = req.query;

    // Convert page & limit to numbers
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build regex search for name, city, state (case-insensitive)
    const searchRegex = new RegExp(query, "i");
    const filter = {
      $or: [
        { name: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
      ],
    };

    // Get total count for pagination
    const total = await DeliveryAddress.countDocuments(filter);

    // Fetch paginated data
    const addresses = await DeliveryAddress.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }); // latest first

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: addresses,
      total,
      totalPages,
      currentPage: pageNum,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getQueryDeliveryAddress };
