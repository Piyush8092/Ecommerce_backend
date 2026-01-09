const CODSetting = require("../../models/CODSettingModel");

const getCodSetting = async (req, res) => {
  try {
    let setting = await CODSetting.findOne({ key: "COD_GLOBAL_SETTING" });

    // If not created yet, return default disabled config
    if (!setting) {
      return res.status(200).json({
        success: true,
        data: {
          isEnabled: false,
          minimumOrderAmount: 0,
          prepaidPercentage: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch COD setting",
    });
  }
};

module.exports = { getCodSetting };
