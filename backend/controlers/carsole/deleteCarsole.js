let Carsole = require("../../models/CarsoleModel");
const { deleteObject } = require("../../services/s3.service");

const deleteCarsole = async (req, res) => {
  try {
    let id = req.params.id;
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch carousel to get image key before deletion
    const carousel = await Carsole.findById(id);
    if (!carousel) {
      return res.status(404).json({
        message: "Carousel not found",
        status: 404,
        success: false,
        error: true,
      });
    }

    // Delete carousel image from S3 if exists
    if (carousel.image) {
      try {
        await deleteObject(carousel.image);
      } catch (s3Error) {
        console.error("Error deleting carousel image from S3:", s3Error);
        // Continue with carousel deletion even if S3 deletion fails
      }
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
