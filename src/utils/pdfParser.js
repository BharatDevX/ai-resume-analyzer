import fs from "fs";
import path from "path";
import { exec } from "child_process";

function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) reject(stderr || err);
      else resolve(stdout);
    });
  });
}

export async function extractResumeText(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("PDF file not found");
  }

  const tmpDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  const imgPrefix = path.join(tmpDir, "page");

  // 1️⃣ PDF → Images
  await execAsync(`pdftoppm "${filePath}" "${imgPrefix}" -png`);

  const images = fs.readdirSync(tmpDir).filter(f => f.endsWith(".png"));

  if (!images.length) {
    throw new Error("PDF to image conversion failed");
  }

  let finalText = "";

  // 2️⃣ OCR via Tesseract CLI
  for (const img of images) {
    const imgPath = path.join(tmpDir, img);
    const txtPath = imgPath.replace(".png", "");

    await execAsync(`tesseract "${imgPath}" "${txtPath}" -l eng`);

    const text = fs.readFileSync(`${txtPath}.txt`, "utf8");
    finalText += text + "\n";
  }

  return finalText.trim();
}
