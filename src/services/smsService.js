// const twilio = require("twilio");

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN,
// );

// exports.sendOTP = async (phone, otp) => {
//   try {
//     if (process.env.SMS_MODE !== "twilio") {
//       console.log("📩 OTP:", otp);
//       return;
//     }

//     const message = await client.messages.create({
//       body: `Your OTP is ${otp}. Valid for 5 minutes.`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: `+91${phone}`,
//     });

//     console.log("✅ SMS Sent SID:", message.sid);
//   } catch (err) {
//     console.error("❌ Twilio Error:", err.message);
//     throw err;
//   }
// };


const axios = require("axios");

exports.sendOTP = async (phone, otp) => {
  try {
    if (process.env.SMS_MODE !== "msg91") {
      console.log("📩 OTP:", otp);
      return;
    }

    const response = await axios.post(
      process.env.MSG91_BASE_URL,
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        short_url: "0",
        recipients: [
          {
            mobiles: "91" + phone,
            OTP: otp
          }
        ]
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ MSG91 SMS Sent:", response.data);
  } catch (err) {
    console.error("❌ MSG91 Error:", err.response?.data || err.message);
    throw err;
  }
};