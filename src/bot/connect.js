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
      console.log("No SESSION_ID found.");
      return false;
    }

    await decodeSession();
    console.log("SESSION_ID decoded successfully.");
  }

  return true;
}

async function startBot() {
  try {
    const runtimeStart = Date.now();
    const ready = await prepareSession();

    if (!ready) return;

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger,
      printQRInTerminal: false,
      auth: state,
      browser: ["Lite-Ollver-MD", "Chrome", "1.0.0"],
      markOnlineOnConnect: false,
      syncFullHistory: false,
      defaultQueryTimeoutMs: 60000
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (messageEvent) => {
      try {
        await handleIncomingMessages(sock, messageEvent, runtimeStart);
      } catch (error) {
        console.error("Message handler error:", error.message);
      }
    });

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "connecting") {
        console.log("Connecting to WhatsApp...");
      }

      if (connection === "open") {
        console.log("Lite-Ollver-MD connected successfully.");
        await sendOwnerConnectedMessage(sock, runtimeStart);
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log("Connection closed.");

        if (statusCode === DisconnectReason.loggedOut) {
          console.log("Session logged out. Generate a new SESSION_ID.");
          return;
        }

        if (shouldReconnect) {
          setTimeout(() => {
            startBot().catch((err) => {
              console.error("Reconnect failed:", err.message);
            });
          }, 8000);
        }
      }
    });

    return sock;
  } catch (error) {
    console.error("Error in startBot:", error.message);
    throw error;
  }
}

module.exports = { startBot };