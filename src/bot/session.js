const fs = require("fs-extra");
const path = require("path");
const config = require("../../config");

const SESSION_DIR = path.join(__dirname, "..", "session");

async function ensureSessionDir() {
  await fs.ensureDir(SESSION_DIR);
}

function getSessionId() {
  return (process.env.SESSION_ID || "").trim();
}

function hasSessionId() {
  return getSessionId().length > 0;
}

function isValidSessionId(sessionId = "") {
  return sessionId.startsWith(config.SESSION_PREFIX);
}

function stripSessionPrefix(sessionId = "") {
  return sessionId.replace(config.SESSION_PREFIX, "").trim();
}

async function sessionFilesExist() {
  const credsFile = path.join(SESSION_DIR, "creds.json");
  return fs.pathExists(credsFile);
}

async function decodeSession() {
  const sessionId = getSessionId();

  if (!sessionId) {
    throw new Error("SESSION_ID is missing.");
  }

  if (!isValidSessionId(sessionId)) {
    throw new Error(
      `Invalid SESSION_ID format. It must start with "${config.SESSION_PREFIX}"`
    );
  }

  await ensureSessionDir();

  const encoded = stripSessionPrefix(sessionId);

  let decodedText;
  try {
    decodedText = Buffer.from(encoded, "base64").toString("utf-8");
  } catch (error) {
    throw new Error("Failed to decode SESSION_ID from Base64.");
  }

  let parsed;
  try {
    parsed = JSON.parse(decodedText);
  } catch (error) {
    throw new Error("Decoded SESSION_ID is not valid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Decoded session data is empty or invalid.");
  }

  if (parsed.creds) {
    await fs.writeJson(path.join(SESSION_DIR, "creds.json"), parsed.creds, {
      spaces: 2
    });

    if (parsed.keys && typeof parsed.keys === "object") {
      for (const [keyName, value] of Object.entries(parsed.keys)) {
        await fs.writeJson(path.join(SESSION_DIR, `${keyName}.json`), value, {
          spaces: 2
        });
      }
    }
  } else {
    await fs.writeJson(path.join(SESSION_DIR, "creds.json"), parsed, {
      spaces: 2
    });
  }

  return true;
}

module.exports = {
  SESSION_DIR,
  ensureSessionDir,
  getSessionId,
  hasSessionId,
  isValidSessionId,
  stripSessionPrefix,
  sessionFilesExist,
  decodeSession
};