let mongoose = require("mongoose");
let Carsole = require("../../models/CarsoleModel");

const deleteCarsole = async (req, res) => {
  try {
    let id = req.params.id;
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const deletedCarsole = await Carsole.findByIdAndDelete(id);
    res.json({
      message: "Carsole deleted successfully",
      status: 200,
      data: deletedCarsole,
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

module.exports = { deleteCarsole };
