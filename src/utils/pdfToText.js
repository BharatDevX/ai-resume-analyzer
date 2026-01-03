import fs from "fs";
import path from "path";
import { fromPath } from "pdf-poppler";
import Tesseract from "tesseract.js";

export async function extractResumeText(filePath) {
  const outputDir = path.join(process.cwd(), "tmp");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const options = {
    format: "png",
    out_dir: outputDir,
    out_prefix: "resume",
    page: null,
  };

  // 🔁 PDF → IMAGES
  await fromPath(filePath, options).bulk(-1);

  const images = fs
    .readdirSync(outputDir)
    .filter(f => f.startsWith("resume") && f.endsWith(".png"));

  if (!images.length) {
    throw new Error("PDF to image conversion failed");
  }

  let finalText = "";

  for (const img of images) {
    const { data } = await Tesseract.recognize(
      path.join(outputDir, img),
      "eng"
    );
    finalText += data.text + "\n";
  }

  return finalText.trim();
}
