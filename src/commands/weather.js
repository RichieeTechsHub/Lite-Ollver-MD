const axios = require("axios");

async function execute(sock, msg, args) {
  const city = args.join(" ");

  if (!city) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .weather Nairobi"
    });
  }

  try {
    const url = `https://wttr.in/${city}?format=j1`;
    const { data } = await axios.get(url);

    const current = data.current_condition[0];

    const text =
      `🌤️ *Weather for ${city}*\n\n` +
      `🌡️ Temp: ${current.temp_C}°C\n` +
      `🤒 Feels: ${current.FeelsLikeC}°C\n` +
      `💧 Humidity: ${current.humidity}%\n` +
      `🌬️ Wind: ${current.windspeedKmph} km/h\n` +
      `☁️ Condition: ${current.weatherDesc[0].value}`;

    await sock.sendMessage(msg.key.remoteJid, { text });

  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to fetch weather."
    });
  }
}

module.exports = { name: "weather", execute };
