import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productImgDir = path.join(__dirname, "../productImg");

if (!fs.existsSync(productImgDir)) {
  fs.mkdirSync(productImgDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productImgDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadProductImg = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "file", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

export const handleUpload = (req, res, next) => {
  uploadProductImg(req, res, (err) => {
    if (err) {
      let message = err.message || "File upload failed";
      if (err.code === "LIMIT_FILE_SIZE") message = "File too large (max 5MB)";
      if (
        err.code === "LIMIT_UNEXPECTED_FILE" ||
        message.includes("Field name missing")
      ) {
        message =
          "Send form-data with key 'file' or 'image', set type to File, then select an image.";
      }
      return res.status(400).json({ success: false, message });
    }
    const files = req.files;
    req.file = (files?.file?.[0] || files?.image?.[0]) ?? null;
    next();
  });
};
