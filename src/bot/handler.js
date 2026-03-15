const fs = require("fs-extra")
const path = require("path")
const config = require("../../config")
const { hasAccess } = require("./permissions")

const SETTINGS_FILE = path.join(__dirname, "..", "database", "settings.json")
const COMMANDS_DIR = path.join(__dirname, "..", "commands")

/* SETTINGS */

async function ensureSettingsFile() {

    const exists = await fs.pathExists(SETTINGS_FILE)

    if (!exists) {

        await fs.writeJson(
            SETTINGS_FILE,
            {
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
            },
            { spaces: 2 }
        )

    }

}

async function getSettings() {

    await ensureSettingsFile()

    try {

        return await fs.readJson(SETTINGS_FILE)

    } catch (error) {

        console.log("Settings read error:", error)

        return {}

    }

}

async function saveSettings(settings) {

    await fs.writeJson(SETTINGS_FILE, settings, { spaces: 2 })

}

/* MESSAGE HELPERS */

function getMessageText(message = {}) {

    return (
        message?.conversation ||
        message?.extendedTextMessage?.text ||
        message?.imageMessage?.caption ||
        message?.videoMessage?.caption ||
        ""
    )

}

function extractCommand(text = "", prefix = ".") {

    if (!text.startsWith(prefix)) return null

    const body = text.slice(prefix.length).trim()

    const parts = body.split(/\s+/)

    const command = parts.shift().toLowerCase()

    const args = parts

    return { command, args, text: args.join(" ") }

}

/* COMMAND LOADER */

async function loadCommands() {

    const commands = new Map()

    const categories = await fs.readdir(COMMANDS_DIR)

    for (const category of categories) {

        const categoryPath = path.join(COMMANDS_DIR, category)

        const stat = await fs.stat(categoryPath)

        if (!stat.isDirectory()) continue

        const files = await fs.readdir(categoryPath)

        for (const file of files) {

            if (!file.endsWith(".js")) continue

            const filePath = path.join(categoryPath, file)

            delete require.cache[require.resolve(filePath)]

            const command = require(filePath)

            if (command.name && command.execute) {

                commands.set(command.name.toLowerCase(), command)

            }

        }

    }

    return commands

}

/* MESSAGE HANDLER */

async function handleMessages(sock, event) {

    try {

        const msg = event.messages?.[0]

        if (!msg) return

        if (msg.key?.fromMe) return

        if (event.type !== "notify") return

        const jid = msg.key.remoteJid

        const senderJid = msg.key.participant || jid

        const settings = await getSettings()

        const text = getMessageText(msg.message)

        if (!text) return

        const parsed = extractCommand(text, settings.prefix || config.PREFIX)

        if (!parsed) return

        const allowed = await hasAccess({
            senderJid,
            mode: settings.mode
        })

        if (!allowed) {

            await sock.sendMessage(jid, {
                text: "⚠️ Bot is in private mode."
            }, { quoted: msg })

            return

        }

        const commands = await loadCommands()

        const commandFile = commands.get(parsed.command)

        if (!commandFile) return

        await commandFile.execute({

            sock,
            msg,
            jid,
            senderJid,
            args: parsed.args,
            text: parsed.text,
            settings,
            config,

            reply: async (textOut) => {

                await sock.sendMessage(
                    jid,
                    { text: textOut },
                    { quoted: msg }
                )

            }

        })

    } catch (error) {

        console.log("Handler error:", error)

    }

}

module.exports = {
    handleMessages,
    getSettings,
    saveSettings
}