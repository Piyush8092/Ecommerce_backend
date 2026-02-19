const AnnouncementMessage = require("../../models/AnnouncementMessage");

const updateAnnouncementMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await AnnouncementMessage.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Announcement updated successfully",
      status: 200,
      data: result,
      success: true,
      error: false,
    });
  } catch (e) {
    res.json({
      message: e.message || "Something went wrong",
      status: 500,
      data: e,
      success: false,
      error: true,
    });
  }
};

module.exports = { updateAnnouncementMessage };
