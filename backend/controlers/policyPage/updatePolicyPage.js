const PolicyPage = require("../../models/PolicyPageSchema");

exports.updatePolicyPage = async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = req.body;

    // Prevent slug from being changed
    if (updateData.slug) delete updateData.slug;

    const updated = await PolicyPage.findOneAndUpdate({ slug }, updateData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Page not found" });

    res
      .status(200)
      .json({ message: "Page updated successfully", page: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
