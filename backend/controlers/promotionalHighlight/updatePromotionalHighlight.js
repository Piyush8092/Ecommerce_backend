const PromotionalHighlight = require("../../models/PromotionalHighlight");

const updatePromotionalHighlight = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await PromotionalHighlight.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({
      message: "Highlight updated successfully",
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

module.exports = updatePromotionalHighlight;
