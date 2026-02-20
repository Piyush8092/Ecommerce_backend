const PromotionalHighlight = require("../../models/PromotionalHighlight");

const deletePromotionalHighlight = async (req, res) => {
  try {
    const { id } = req.params;

    await PromotionalHighlight.findByIdAndDelete(id);

    res.json({
      message: "Highlight deleted successfully",
      status: 200,
      success: true,
      error: false
    });

  } catch (e) {
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e,
      success: false,
      error: true
    });
  }
};

module.exports = deletePromotionalHighlight;

