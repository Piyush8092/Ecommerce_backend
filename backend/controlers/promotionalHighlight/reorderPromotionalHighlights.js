const PromotionalHighlight = require("../../models/PromotionalHighlight");

const reorderPromotionalHighlights = async (req, res) => {
  try {
    const updates = req.body;

    const bulkOps = updates.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    console.log(bulkOps);

    await PromotionalHighlight.bulkWrite(bulkOps);

    res.json({
      message: "Order updated successfully",
      status: 200,
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

module.exports = reorderPromotionalHighlights;
