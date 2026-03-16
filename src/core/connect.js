async function connect() {
  console.log("📁 Checking session folder...");
  
  // Check if session folder exists
  if (!fs.existsSync("./session")) {
    console.log("❌ No session folder found!");
    console.log("📌 Please add your session files");
    return;
  }
  
  const files = fs.readdirSync("./session");
  console.log(`✅ Found ${files.length} session files`);
  
  if (files.length === 0) {
    console.log("❌ Session folder is empty!");
    return;
  }

  console.log("🔐 Attempting to connect with existing session...");
  
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false
  });

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "connecting") {
      console.log("🔄 Connecting to WhatsApp...");
    }
    
    if (connection === "open") {
      console.log("✅✅✅ BOT CONNECTED SUCCESSFULLY! ✅✅✅");
      console.log(`👑 Logged in as: ${sock.user?.name || "Unknown"}`);
      console.log(`📱 Phone: ${sock.user?.id || "Unknown"}`);
    }
    
    if (connection === "close") {
      console.log("❌ Connection closed:", lastDisconnect?.error?.message);
    }
  });

  return sock;
}
