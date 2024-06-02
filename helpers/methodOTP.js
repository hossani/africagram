const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const generateOTP = () => {
    // Génère un nombre OTP à 6 chiffres
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const sendOtp = async (phoneNumber, otp) => {
    await client.messages.create({
      body: `Votre code de vérification est : ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
  };

  module.exports={generateOTP,sendOtp}