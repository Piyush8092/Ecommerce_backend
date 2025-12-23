let DeliveryAddress = require("../../models/deliveryAddressModel");

const getSpecificUserAddrressMannegerAndEmployeView = async (req, res) => {
  try {
    let userId = req.params.id;
    if (
      !(
        req.user.role === "MANAGER" ||
        req.user.role === "EMPLOYEE" ||
        req.user.role === "ADMIN" ||
        req.user._id.toString() === userId.toString()
      )
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const deliveryAddress = await DeliveryAddress.find({ userId });
    res.json({
      message: "Delivery address fetched successfully",
      status: 200,
      data: deliveryAddress,
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

module.exports = { getSpecificUserAddrressMannegerAndEmployeView };
