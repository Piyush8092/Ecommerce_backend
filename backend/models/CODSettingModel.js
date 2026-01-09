const mongoose = require("mongoose");

const codSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "COD_GLOBAL_SETTING",
      unique: true,
      immutable: true,
    },

    isEnabled: {
      type: Boolean,
      default: false,
    },

    minimumOrderAmount: {
      type: Number,
      min: 0,
    },

    prepaidPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("CODSetting", codSettingSchema);
