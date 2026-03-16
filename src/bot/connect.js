const nodeCrypto = require("crypto");

if (!global.crypto) global.crypto = nodeCrypto.webcrypto;
if (!globalThis.crypto) globalThis.crypto = nodeCrypto.webcrypto;
if (!global.webcrypto) global.webcrypto = nodeCrypto.webcrypto;
if (!globalThis.webcrypto) globalThis.webcrypto = nodeCrypto.webcrypto;

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

let reconnectAttempts = 0;
let isStarting = false;

async function prepareSession() {
  if (!(await sessionFilesExist())) {
    if (!hasSessionId()) {
      console.log("⚠️ No SESSION_ID found in environment variables.");
      console.log("ℹ️ Add a valid SESSION_ID in Heroku config vars.");
      return false;
    }

    await decodeSession();
    console.log("✅ SESSION_ID decoded successfully.");
  }

  return true;
}

async function startBot() {
  if (isStarting) return;
  isStarting = true;

  try {
    const runtimeStart = Date.now();
    const ready = await prepareSession();

    if (!ready) {
      isStarting = false;
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
      markOnlineOnConnect: false,
      syncFullHistory: false,
      defaultQueryTimeoutMs: 60000
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (messageEvent) => {
      try {
        await handleIncomingMessages(sock, messageEvent);
      } catch (error) {
        console.error("❌ Message handler error:", error.message);
      }
    });

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log("⚠️ QR was generated unexpectedly. SESSION_ID may be invalid or missing.");
      }

      if (connection === "connecting") {
        console.log("🔄 Connecting Lite-Ollver-MD to WhatsApp...");
      }

      if (connection === "open") {
        reconnectAttempts = 0;
        isStarting = false;
        console.log("✅ Lite-Ollver-MD connected successfully.");
        await sendOwnerConnectedMessage(sock, runtimeStart);
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const errorMessage =
          lastDisconnect?.error?.message ||
          lastDisconnect?.error?.output?.payload?.message ||
          "Unknown error";

        console.log(`❌ Connection closed. Code: ${statusCode || "none"} | ${errorMessage}`);

        isStarting = false;

        if (statusCode === DisconnectReason.loggedOut) {
          console.log("🚫 Session logged out. Generate a new SESSION_ID.");
          return;
        }

        reconnectAttempts += 1;

        if (reconnectAttempts > 5) {
          console.log("🛑 Too many reconnect attempts. Stopping to protect memory.");
          return;
        }

        const delay = 10000;
        console.log(`♻️ Reconnecting in ${delay / 1000} seconds... Attempt ${reconnectAttempts}/5`);

        setTimeout(() => {
          startBot().catch((err) => {
            console.error("Reconnect failed:", err.message);
          });
        }, delay);
      }
    });

    return sock;
  } catch (error) {
    isStarting = false;
    console.error("❌ Error in startBot:", error.message);
    throw error;
  }
}

module.exports = { startBot };
