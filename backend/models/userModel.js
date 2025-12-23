const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^[0-9]{10}$/, "Invalid phone number"],
    },
    image: {
      type: String,
    },

    role: {
      type: String,
      // order accept delete and fororder,  emplye => diplsy employ section
      enum: ["GENERAL", "ADMIN", "MANAGER", "EMPLOYEE"],
      default: "GENERAL",
    },
    token: {
      type: String,
    },
    isPhoneVerified: {
      type: Boolean,
      default: true,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    loginDeviceName: [
      {
        type: String,
      },
    ],

    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

/**
 * Custom validation: require at least email or phone
 */
userSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    this.invalidate("email", "Either email or phone is required");
    this.invalidate("phone", "Either email or phone is required");
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
