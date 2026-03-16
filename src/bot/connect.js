const pino = require("pino");
const {
  default: makeWASocket,
  fetchLatestBaileysVersion,
  DisconnectReason,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");

const {
  SESSION_DIR,
  hasSessionId,
  sessionFilesExist,
  decodeSession
} = require("./session");

const { handleIncomingMessages, sendOwnerConnectedMessage } = require("./handler");

const logger = pino({ level: "silent" });

async function prepareSession() {
  if (!(await sessionFilesExist())) {
    if (!hasSessionId()) {
      console.log("⚠️ No SESSION_ID found in environment variables.");
      console.log("ℹ️ Add SESSION_ID in Heroku config vars before starting the bot.");
      return false;
    }

    await decodeSession();
    console.log("✅ SESSION_ID decoded successfully.");
  }

  return true;
}

async function startBot() {
  try {
    const runtimeStart = Date.now();
    const ready = await prepareSession();

    if (!ready) {
      console.log("⏳ Bot startup stopped because session is missing.");
      return;
    }

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger,
      printQRInTerminal: false,
      auth: state,
      browser: ["Lite-Ollver-MD", "Chrome", "1.0.0"],
      markOnlineOnConnect: true,
      syncFullHistory: false
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (messageEvent) => {
      await handleIncomingMessages(sock, messageEvent, runtimeStart);
    });

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "connecting") {
        console.log("🔄 Connecting Lite-Ollver-MD to WhatsApp...");
      }

      if (connection === "open") {
        console.log("✅ Lite-Ollver-MD connected successfully.");
        await sendOwnerConnectedMessage(sock, runtimeStart);
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log("❌ Connection closed.");

        if (statusCode === DisconnectReason.loggedOut) {
          console.log("🚫 Session logged out. Generate a new SESSION_ID.");
          return;
        }

        if (shouldReconnect) {
          console.log("♻️ Reconnecting in 5 seconds...");
          setTimeout(() => {
            startBot().catch((err) => {
              console.error("Reconnect failed:", err);
            });
          }, 5000);
        }
      }
    });

    return sock;
  } catch (error) {
    console.error("❌ Error in startBot:", error);
    throw error;
  }
}

module.exports = { startBot };