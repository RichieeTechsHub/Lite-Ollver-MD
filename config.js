require('dotenv').config();

module.exports = {
  // Bot Identity - READ FROM ENVIRONMENT VARIABLES
  BOT_NAME: process.env.BOT_NAME || "Lite-Ollver-MD",
  SESSION_ID: process.env.SESSION_ID || "",
  PREFIX: process.env.PREFIX || ".",
  VERSION: "1.0.0",
  
  // Owner Info
  OWNER_NAME: process.env.OWNER_NAME || "RichieeTheeGoat",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "254740479599",
  OWNER_CONTACT: `https://wa.me/${process.env.OWNER_NUMBER || "254740479599"}`,
  
  // Bot Settings
  MODE: process.env.MODE || "public",
  TIMEZONE: process.env.TIMEZONE || "Africa/Nairobi",
  
  // Support
  SUPPORT_GROUP: "https://chat.whatsapp.com/JKF3XHbmKY47IQZc7d3LB2"
};
