let Carsole = require("../../models/CarsoleModel");
const { deleteObject } = require("../../services/s3.service");

const updateCarsole = async (req, res) => {
  try {
    const payload = req.body;
    const id = req.params.id;

    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existCarsole = await Carsole.findById(id);
    if (!existCarsole) {
      return res.status(404).json({ message: "Carsole not found" });
    }

    const updatedCarsole = await Carsole.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    // Delete old image ONLY if a new one is provided
    if (
      payload.image &&
      existCarsole.image &&
      payload.image !== existCarsole.image
    ) {
      try {
        await deleteObject(existCarsole.image);
      } catch (err) {
        console.error("Failed to delete old carsole image:", err);
      }
    }

    res.json({
      message: "Carsole updated successfully",
      status: 200,
      data: updatedCarsole,
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

module.exports = { updateCarsole };
