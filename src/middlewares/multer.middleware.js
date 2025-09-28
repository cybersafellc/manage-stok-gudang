// setup multer TANPA fileFilter
import multer from "multer";
import path from "path";
import crypto from "crypto";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/shp");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(6).toString("hex");
    cb(null, Date.now() + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: fileStorage });

// middleware multer
const multers = upload.single("file");

export { multers };
