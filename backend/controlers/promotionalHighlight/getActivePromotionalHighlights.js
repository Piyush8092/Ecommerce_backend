const PromotionalHighlight = require("../../models/PromotionalHighlight");

const getActivePromotionalHighlights = async (req, res) => {
  try {
    const result = await PromotionalHighlight.find({ isActive: true }).sort({
      order: 1,
    });

    res.json({
      message: "Highlights fetched successfully",
      status: 200,
      data: result,
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

module.exports = getActivePromotionalHighlights;
