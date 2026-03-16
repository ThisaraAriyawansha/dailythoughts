import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

export const config = {
  api: { bodyParser: false },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const form = formidable({
    uploadDir: "/tmp",
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  });

  form.parse(req, async (err, _fields, files) => {
    if (err) return res.status(500).json({ error: "Failed to parse file." });

    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!file) return res.status(400).json({ error: "No image provided." });

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: "dailythoughts",
      });
      return res.status(200).json({ path: result.secure_url });
    } catch {
      return res.status(500).json({ error: "Cloudinary upload failed." });
    }
  });
}
