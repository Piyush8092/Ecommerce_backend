const AnnouncementMessage = require("../../models/AnnouncementMessage");

const createAnnouncementMessage = async (req, res) => {
  try {
    const { message, redirectUrl, order, isActive, startAt, endAt } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
        status: 400,
        success: false,
        error: true,
      });
    }

    const newAnnouncement = new AnnouncementMessage({
      message,
      redirectUrl,
      order,
      isActive,
      startAt,
      endAt,
    });

    const result = await newAnnouncement.save();

    res.json({
      message: "Announcement created successfully",
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

module.exports = { createAnnouncementMessage };
