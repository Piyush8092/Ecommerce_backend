const CODSetting = require("../../models/CODSettingModel");

const updateCodSetting = async (req, res) => {
  try {
    const { isEnabled, minimumOrderAmount, prepaidPercentage } = req.body;

    if (prepaidPercentage < 0 || prepaidPercentage > 100) {
      return res.status(400).json({
        success: false,
        message: "Prepaid percentage must be between 0 and 100",
      });
    }

    let setting = await CODSetting.findOne({ key: "COD_GLOBAL_SETTING" });

    if (!setting) {
      setting = new CODSetting({
        key: "COD_GLOBAL_SETTING",
        isEnabled,
        minimumOrderAmount,
        prepaidPercentage,
      });
    } else {
      setting.isEnabled = isEnabled;
      setting.minimumOrderAmount = minimumOrderAmount;
      setting.prepaidPercentage = prepaidPercentage;
    }

    await setting.save();

    res.status(200).json({
      success: true,
      message: "COD setting updated successfully",
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update COD setting",
    });
  }
};

module.exports = { updateCodSetting };
