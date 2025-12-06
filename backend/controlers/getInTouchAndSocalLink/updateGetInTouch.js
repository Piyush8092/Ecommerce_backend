let GetInTouch = require("../../models/GetInTouchModel");

const updateGetInTouch = async (req, res) => {
  try {
    const payload = req.body;
    const id = req.params.id;
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updatedGetInTouch = await GetInTouch.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Get in touch updated successfully",
      status: 200,
      data: updatedGetInTouch,
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

module.exports = { updateGetInTouch };
