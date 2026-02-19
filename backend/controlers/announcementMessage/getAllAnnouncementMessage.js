const AnnouncementMessage = require("../../models/AnnouncementMessage");

const getAllAnnouncementMessage = async (req, res) => {
  try {
    const result = await AnnouncementMessage.find().sort({ order: 1 });

    res.json({
      message: "All announcements fetched successfully",
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

module.exports = { getAllAnnouncementMessage };
