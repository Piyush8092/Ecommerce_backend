let Carsole = require("../../models/CarsoleModel");

const getCarsole = async (req, res) => {
  try {
    const carsole = await Carsole.find().populate("categoryId", "name");
    res.json({
      message: "Carsole fetched successfully",
      status: 200,
      data: carsole,
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

module.exports = { getCarsole };
