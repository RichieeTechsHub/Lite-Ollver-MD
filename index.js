const path = require("path");
const fs = require("fs-extra");
const config = require("./config");
const { startBot } = require("./src/bot/connect");
const { startServer } = require("./server");

async function ensureProjectFiles() {
  const dbDir = path.join(__dirname, "src", "database");
  const publicDir = path.join(__dirname, "public");
  const sessionDir = path.join(__dirname, "src", "session");

  await fs.ensureDir(dbDir);
  await fs.ensureDir(publicDir);
  await fs.ensureDir(sessionDir);

  const defaultFiles = [
    {
      file: path.join(dbDir, "settings.json"),
      data: {
        botName: config.BOT_NAME,
        ownerName: config.OWNER_NAME,
        ownerNumber: config.OWNER_NUMBER,
        mode: config.MODE,
        prefix: config.PREFIX,
        timezone: config.TIMEZONE,
        autotyping: config.AUTOTYPING,
        autorecording: config.AUTORECORDING,
        autoreadstatus: config.AUTOREAD_STATUS,
        autoreactstatus: config.AUTOREACT_STATUS,
        statusEmoji: config.STATUS_EMOJI,
        statusDelay: config.STATUS_DELAY,
        supportGroup: config.SUPPORT_GROUP,
        ownerContact: config.OWNER_CONTACT
      }
    },
    {
      file: path.join(dbDir, "sudo.json"),
      data: { sudo: [] }
    },
    {
      file: path.join(dbDir, "users.json"),
      data: {}
    },
    {
      file: path.join(dbDir, "groups.json"),
      data: {}
    }
  ];

  for (const item of defaultFiles) {
    const exists = await fs.pathExists(item.file);
    if (!exists) {
      await fs.writeJson(item.file, item.data, { spaces: 2 });
    }
  }

  const healthFile = path.join(publicDir, "health.html");
  const healthExists = await fs.pathExists(healthFile);

  if (!healthExists) {
    await fs.writeFile(
      healthFile,
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lite-Ollver-MD</title>
</head>
<body style="font-family: Arial, sans-serif; background:#0b1220; color:#fff; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
  <div style="text-align:center;">
    <h1>Lite-Ollver-MD is running ✅</h1>
    <p>WhatsApp bot server is active.</p>
  </div>
</body>
</html>`
    );
  }
}

async function bootstrap() {
  try {
    console.log("🚀 Starting Lite-Ollver-MD...");
    await ensureProjectFiles();
    startServer();
    await startBot();
  } catch (error) {
    console.error("❌ Failed to start bot:", error);
    process.exit(1);
  }
}

bootstrap();