let mongoose = require("mongoose");

let getInTouchSchema = new mongoose.Schema(
  {
    // Email Section
    email: {
      general: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      support: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      business: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      careers: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
    },

    // Phone Section
    phone: {
      primary: {
        type: String,
        required: true,
        trim: true,
      },
      support: {
        type: String,
        required: true,
        trim: true,
      },
      whatsapp: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // Address Section
    address: {
      type: String,
      required: true,
      trim: true,
    },

    // Business Hours Section
    businessHours: {
      weekdays: {
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
        closed: { type: Boolean, default: false },
      },
      saturday: {
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
        closed: { type: Boolean, default: false },
      },
      sunday: {
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
        closed: { type: Boolean, default: false },
      },
    },

    // Timezone
    timezone: {
      type: String,
      default: "IST (Indian Standard Time)",
      trim: true,
    },

    // Social Media Links
    socialMedia: {
      facebook: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      linkedin: {
        type: String,
        trim: true,
      },
      youtube: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GetInTouch", getInTouchSchema);
