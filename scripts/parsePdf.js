const fs = require("fs");

// ✅ FORCE correct pdf-parse entry
const pdfParse = require("pdf-parse/lib/pdf-parse");

(async () => {
  try {
    const filePath = process.argv[2];

    console.log("📄 Parsing file:", filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error("PDF file does not exist");
    }

    const buffer = fs.readFileSync(filePath);
    console.log("📦 File size:", buffer.length);

    const data = await pdfParse(buffer);

    console.log("✅ PDF parsed successfully");
    process.stdout.write(data.text);
  } catch (err) {
    console.error("❌ PDF PARSE ERROR:", err);
    process.exit(1);
  }
})();
