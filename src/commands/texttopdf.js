const PDFDocument = require("pdfkit");

async function execute(sock, msg, args) {
  try {
    const text = args.join(" ");

    if (!text) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Usage: .texttopdf your text here"
      });
    }

    const doc = new PDFDocument({
      margin: 50,
      size: "A4"
    });

    const chunks = [];

    doc.on("data", chunk => chunks.push(chunk));

    const done = new Promise(resolve => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    doc.fontSize(18).text("Lite-Ollver-MD Document", {
      align: "center"
    });

    doc.moveDown();
    doc.fontSize(12).text(text, {
      align: "left",
      lineGap: 4
    });

    doc.end();

    const pdfBuffer = await done;

    await sock.sendMessage(msg.key.remoteJid, {
      document: pdfBuffer,
      fileName: "Lite-Ollver-MD.pdf",
      mimetype: "application/pdf",
      caption: "✅ PDF created."
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to create PDF."
    });
  }
}

module.exports = {
  name: "texttopdf",
  description: "Convert text to PDF",
  execute
};
