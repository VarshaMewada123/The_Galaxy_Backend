const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

exports.sendOTP = async (phone, otp) => {
  try {
    if (process.env.SMS_MODE !== "twilio") {
      console.log("📩 OTP:", otp);
      return;
    }

    const message = await client.messages.create({
      body: `Your OTP is ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });

    console.log("✅ SMS Sent SID:", message.sid);
  } catch (err) {
    console.error("❌ Twilio Error:", err.message);
    throw err;
  }
};
