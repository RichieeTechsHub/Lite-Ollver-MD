require("dotenv").config();

// Clean number (very important for Baileys)
function cleanNumber(num = "") {
  return String(num).replace(/\D/g, "");
}

const OWNER_NUMBER = cleanNumber(
  process.env.OWNER_NUMBER || "254740479599"
);

module.exports = {
  // Bot Identity
  BOT_NAME: process.env.BOT_NAME || "Lite-Ollver-MD",
  SESSION_ID: process.env.SESSION_ID || "",
  PREFIX: process.env.PREFIX || ".",
  VERSION: "1.0.0",

  // Owner Info (FIXED FORMAT)
  OWNER_NAME: process.env.OWNER_NAME || "RichieeTheeGoat",
  OWNER_NUMBER: OWNER_NUMBER,
  OWNER_JID: OWNER_NUMBER + "@s.whatsapp.net",
  OWNER_CONTACT: `https://wa.me/${OWNER_NUMBER}`,

  // Bot Settings
  MODE: process.env.MODE || "public", // public / private
  TIMEZONE: process.env.TIMEZONE || "Africa/Nairobi",

  // Support
  SUPPORT_GROUP:
    process.env.SUPPORT_GROUP ||
    "https://chat.whatsapp.com/JKF3XHbmKY47IQZc7d3LB2"
};
