let Carsole = require("../../models/CarsoleModel");

const updateProduct = async (req, res) => {
  try {
    const payload = req.body;
    let id = req.params.id;
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!payload && Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }
    console.log(payload);
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      payload,
      { new: true }
    );
    res.json({
      message: "Carsole updated successfully",
      status: 200,
      data: updatedProduct,
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

module.exports = { updateProduct };
