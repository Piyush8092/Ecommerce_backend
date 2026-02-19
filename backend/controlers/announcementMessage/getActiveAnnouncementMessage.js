const AnnouncementMessage = require("../../models/AnnouncementMessage");

const getActiveAnnouncementMessage = async (req, res) => {
  try {
    const now = new Date();

    const result = await AnnouncementMessage.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startAt: null },
            { startAt: { $lte: now } }
          ]
        },
        {
          $or: [
            { endAt: null },
            { endAt: { $gte: now } }
          ]
        }
      ]
    }).sort({ order: 1 });

    res.json({
      message: "Active announcements fetched successfully",
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

module.exports = { getActiveAnnouncementMessage };
