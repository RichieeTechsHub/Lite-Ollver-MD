const fs = require("fs-extra");
const path = require("path");

const SESSION_DIR = path.join(process.cwd(), "session");

async function ensureSessionDir() {
  await fs.ensureDir(SESSION_DIR);
}

function getSessionId() {
  return (process.env.SESSION_ID || "").trim();
}

function hasSessionId() {
  return getSessionId().length > 0;
}

async function sessionFilesExist() {
  const credsFile = path.join(SESSION_DIR, "creds.json");
  return await fs.pathExists(credsFile);
}

function stripKnownPrefixes(sessionId = "") {
  return sessionId
    .replace(/^LITE-OLLVER-MD[:~]/i, "")
    .replace(/^LITE-OLIVER-MD[:~]/i, "")
    .replace(/^ELITE-OLLVER-MD[:~]/i, "")
    .trim();
}

async function decodeSession() {
  const raw = getSessionId();

  if (!raw) {
    throw new Error("SESSION_ID is missing.");
  }

  await ensureSessionDir();

  const cleaned = stripKnownPrefixes(raw);

  let decodedText;
  try {
    decodedText = Buffer.from(cleaned, "base64").toString("utf-8");
  } catch (error) {
    throw new Error("Failed to decode SESSION_ID from base64.");
  }

  let parsed;
  try {
    parsed = JSON.parse(decodedText);
  } catch (error) {
    throw new Error("Decoded SESSION_ID is not valid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Decoded session data is invalid.");
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
  sessionFilesExist,
  decodeSession
};
