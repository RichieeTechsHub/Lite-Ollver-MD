const fs = require("fs");

const file = "src\\core\\connect.js";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
`function isAllowedPrivateUser(sender, settings) {
  const owner = cleanNumber(OWNER_NUMBER);
  const sudoList = Array.isArray(settings.sudo) ? settings.sudo.map(cleanNumber) : [];
  return sender === owner || sudoList.includes(sender);
}`,
`function isAllowedPrivateUser(sender, settings, msg, sock) {
  const owner = cleanNumber(settings.ownerNumber || OWNER_NUMBER);
  const botNumber = cleanNumber(sock.user?.id || "");
  const sudoList = Array.isArray(settings.sudo) ? settings.sudo.map(cleanNumber) : [];

  return (
    msg.key.fromMe ||
    sender === owner ||
    sender === botNumber ||
    sudoList.includes(sender)
  );
}`
);

code = code.replace(
`if (mode === "private" && !isAllowedPrivateUser(sender, settings)) {`,
`if (mode === "private" && !isAllowedPrivateUser(sender, settings, msg, sock)) {`
);

fs.writeFileSync(file, code);
console.log("✅ connect.js private mode owner/host/sudo access fixed.");
