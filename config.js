require('dotenv').config();

module.exports = {
  // 🤖 Bot Identity - from environment
  BOT_NAME: process.env.BOT_NAME || "Lite-Ollver-MD",
  SESSION_ID: process.env.SESSION_ID || "",
  
  // 📦 Version - hardcoded
  VERSION: "1.0.0",
  
  // 👑 Owner Info - hardcoded (private)
  OWNER_NAME: "RichieeTheeGoat",
  OWNER_NUMBER: "254740479599",
  OWNER_CONTACT: "https://wa.me/254740479599",
  
  // ⚙️ Bot Settings - hardcoded
  PREFIX: ".",
  MODE: "public",
  TIMEZONE: "Africa/Nairobi",
  
  // 💬 Support - hardcoded
  SUPPORT_GROUP: "https://chat.whatsapp.com/JKF3XHbmKY47IQZc7d3LB2"
};