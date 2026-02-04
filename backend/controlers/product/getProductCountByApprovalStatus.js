let productModel = require("../../models/productModel");

const getProductCountByApprovalStatus = async (req, res) => {
  try {
    const counts = await productModel.aggregate([
      {
        $match: {
          isDeleted: false,
          approvalStatus: { $in: ["PENDING", "REJECTED"] },
        },
      },
      {
        $group: {
          _id: "$approvalStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      PENDING: 0,
      REJECTED: 0,
    };

    counts.forEach((item) => {
      result[item._id] = item.count;
    });

    res.status(200).json({
      message: "approval status product counts retrieved successfully",
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

module.exports = { getProductCountByApprovalStatus };
