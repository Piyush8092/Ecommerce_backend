let PrivacyPolicyModel = require("../../models/privacyModel");

const createPrivacyPolicy = async (req, res) => {
  try {
    let payload = req.body;

    // Check admin authorization
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    // Validate required fields according to schema
    if (!payload.content) {
      return res.status(400).json({
        message: "Content is a required field",
        status: 400,
        success: false,
        error: true,
      });
    }

    // Validate sections array if provided
    // if (payload.sections && Array.isArray(payload.sections)) {
    //     for (let section of payload.sections) {
    //         if (!section.number || !section.title) {
    //             return res.status(400).json({
    //                 message: 'Section number and title are required for each section',
    //                 status: 400,
    //                 success: false,
    //                 error: true
    //             });
    //         }
    //     }
    // }

    const newPrivacyPolicy = new PrivacyPolicyModel(payload);
    newPrivacyPolicy.createdBy = req.user._id; // Set the user ID as the creator of the policy document
    const result = await newPrivacyPolicy.save();

    res.json({
      message: "Privacy policy created successfully",
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

module.exports = { createPrivacyPolicy };
