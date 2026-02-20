let mongoose = require("mongoose");

const AnnouncementMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },

    redirectUrl: {
      type: String,
      default: null,
    },

    order: {
      type: Number,
      default: 0,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    startAt: {
      type: Date,
      default: null,
    },

    endAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

AnnouncementMessageSchema.pre("save", function (next) {
  if (this.startAt && this.endAt && this.startAt > this.endAt) {
    return next(new Error("startAt must be before endAt"));
  }
  next();
});

AnnouncementMessageSchema.index({
  isActive: 1,
  startAt: 1,
  endAt: 1,
  order: 1,
});

module.exports = mongoose.model(
  "AnnouncementMessage",
  AnnouncementMessageSchema
);
