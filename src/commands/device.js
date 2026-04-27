const os = require("os");

async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📱 *DEVICE INFO*\n\n" +
      "Platform: " + os.platform() + "\n" +
      "CPU: " + os.cpus()[0].model + "\n" +
      "RAM: " + Math.round(os.totalmem()/1024/1024) + " MB"
  });
}

module.exports = { name: "device", description: "Device info", execute };
