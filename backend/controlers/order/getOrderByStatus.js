const Order = require("../../models/orderModel");

function buildSort(req) {
  const { sortBy } = req.query;

  // You can customize sort options
  const sortOptions = {
    price_low_to_high: { totalAmount: 1 },
    price_high_to_low: { totalAmount: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };

  return sortOptions[sortBy] || { createdAt: -1 };
}

const getOrderByStatus = async (req, res) => {
  try {
    const orderStatus = req.query.orderStatus.toUpperCase(); // convert status to uppercase for consistency
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userId = req.user._id; // get the user ID from the request object

    let filter = { userId }; // initialize filter object with the user ID

    if (orderStatus !== "ALL") {
      filter.status = orderStatus;
    }
    // count for pagination
    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // fetch orders
    const orders = await Order.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("deliveryAddressId")
      .sort(buildSort(req)); // use the buildSort function to build the sort object

    res.status(200).json({
      message: "Orders fetched successfully",
      status: 200,
      data: orders,
      success: true,
      error: false,
      total,
      totalPages,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Something went wrong",
      status: 500,
      data: e.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { getOrderByStatus };
