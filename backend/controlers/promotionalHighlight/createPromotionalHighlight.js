const PromotionalHighlight = require("../../models/PromotionalHighlight");

const createPromotionalHighlight = async (req, res) => {
  try {
    const { text, order, isActive } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Text is required",
        status: 400,
        success: false,
        error: true,
      });
    }

    const newItem = new PromotionalHighlight({
      text,
      order,
      isActive,
    });

    const result = await newItem.save();

    res.json({
      message: "Highlight created successfully",
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

module.exports = createPromotionalHighlight;
