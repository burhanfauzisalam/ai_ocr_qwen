const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 1000;

// Setup penyimpanan upload
const upload = multer({ dest: "uploads/" });

// Endpoint: upload gambar lalu OCR
app.post("/ocr", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // Jalankan OCR
    const result = await Tesseract.recognize(imagePath, "ind", {
      logger: (m) => console.log(m), // Untuk melihat progress di console
    });

    // Hapus file setelah digunakan
    fs.unlinkSync(imagePath);

    res.json({
      text: result.data.text,
    });
  } catch (err) {
    res.status(500).json({ error: "OCR gagal", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`OCR server listening at ${port}`);
});
