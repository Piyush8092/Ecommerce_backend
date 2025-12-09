let GetInTouch = require("../../models/GetInTouchModel");

const deleteGetInTouch = async (req, res) => {
  try {
    const deleted = await GetInTouch.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Get in touch entry not found",
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: "Get in touch deleted successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      success: false,
      error: true,
    });
  }
};

module.exports = { deleteGetInTouch };
