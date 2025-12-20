const axios = require("axios");
const OTP = require("../models/otpModel");

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;

/**
 * Generate 6 digit OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send SMS using Fast2SMS
 */
const sendOtpSms = async (phone, otp) => {
  const response = await axios.post(
    "https://www.fast2sms.com/dev/bulkV2",
    {
      route: "dlt",
      sender_id: process.env.FAST2SMS_SENDER_ID, // eg: NAKSHP
      message: process.env.FAST2SMS_TEMPLATE_ID, // DLT template ID
      variables_values: `Nakshpath|${otp}|`,
      numbers: phone,
    },
    {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );

  if (!response.data || response.data.return !== true) {
    console.error("Fast2SMS Error:", response.data);
    throw new Error("Failed to send OTP");
  }

  return true;
};

/**
 * Create and send OTP
 */
const createAndSendOtp = async (phone) => {
  if (!phone) {
    throw new Error("Phone number is required");
  }

  // delete old OTPs
  await OTP.deleteMany({ phone });

  const otp = generateOtp();

  await OTP.create({
    phone,
    otp,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  });

  await sendOtpSms(phone, otp);

  return true;
};

/**
 * Verify OTP
 */
const verifyOtp = async (phone, otp) => {
  const record = await OTP.findOne({ phone });

  if (!record) {
    throw new Error("OTP expired or not found");
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await OTP.deleteMany({ phone });
    throw new Error("Too many invalid attempts");
  }

  if (record.otp !== otp) {
    record.attempts += 1;
    await record.save();
    throw new Error("Invalid OTP");
  }

  // success
  await OTP.deleteMany({ phone });
  return true;
};

module.exports = {
  createAndSendOtp,
  verifyOtp,
};
