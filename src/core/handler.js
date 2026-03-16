const config = require("../../config")
const fs = require("fs")
const path = require("path")
const { sendMenuWithLogo } = require("../commands/menu")

const commands = {}

// auto load commands
const commandsPath = path.join(__dirname, "../commands")

fs.readdirSync(commandsPath).forEach(file => {
    
    if (!file.endsWith(".js")) return
    if (file === "menu.js") return

    const commandFile = require(`../commands/${file}`)

    if (typeof commandFile.execute === "function") {
        commands[file.replace(".js","")] = commandFile
    }

})

console.log(`📦 Loaded ${Object.keys(commands).length} command modules`)

async function sendStartupMessage(sock) {

    try {

        const ownerJid = config.OWNER_NUMBER + "@s.whatsapp.net"

        const text = `✅ *${config.BOT_NAME} Connected*

👑 Owner: ${config.OWNER_NAME}
⚡ Mode: ${config.MODE}
🔣 Prefix: ${config.PREFIX}

Type *.menu* to view commands.`

        await sock.sendMessage(ownerJid,{ text })

        console.log("✅ Startup message sent")

    } catch(e){

        console.log("⚠️ Failed sending startup message")

    }

}

async function handleMessages(sock,msg){

try{

    const from = msg.key.remoteJid
    const sender = msg.key.participant || from

    const senderNumber = sender.split("@")[0]
    const isOwner = senderNumber === config.OWNER_NUMBER

    const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        ""

    if(!text) return

    if(!text.startsWith(config.PREFIX)) return

    const args = text.slice(config.PREFIX.length).trim().split(/ +/)
    const command = args.shift().toLowerCase()

    console.log(`⚡ ${command} from ${senderNumber}`)

    if(command === "menu" || command === "help"){

        await sendMenuWithLogo(sock,from,msg)
        return

    }

    // check command module
    const module = commands[command]

    if(!module){

        console.log(`❓ Unknown command: ${command}`)
        return

    }

    const response = await module.execute(command,{
        sock,
        from,
        msg,
        args,
        isOwner,
        config
    })

    if(response){

        await sock.sendMessage(from,{ text: response },{ quoted: msg })

    }

}catch(err){

console.log("❌ Handler error:",err.message)

}

}

module.exports = { handleMessages, sendStartupMessage }
