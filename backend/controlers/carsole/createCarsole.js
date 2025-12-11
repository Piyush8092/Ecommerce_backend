let Carsole = require("../../models/CarsoleModel");
const createCarsole = async (req, res) => {
  try {
    const { heading, title, image, categoryId } = req.body;
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!heading || !title || !image || !categoryId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new carsole
    const newCarsole = new Carsole({
      heading,
      title,
      image,
      categoryId,
    });

    const savedCarsole = await newCarsole.save();

    res.json({
      message: "Carsole created successfully",
      status: 200,
      data: savedCarsole,
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

module.exports = { createCarsole };
