const AnnouncementMessage = require("../../models/AnnouncementMessage");

const deleteAnnouncementMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await AnnouncementMessage.findByIdAndDelete(id);

    res.json({
      message: "Announcement deleted successfully",
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

module.exports = { deleteAnnouncementMessage };
