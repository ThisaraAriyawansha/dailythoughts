import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { getCollection } from "@/lib/db";

export const config = {
  api: { bodyParser: false },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try { resolve(JSON.parse(data)); }
      catch { resolve({}); }
    });
    req.on("error", reject);
  });
}

function parseMultipart(req) {
  const form = formidable({
    uploadDir: "/tmp",
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);

      const get = (key) => {
        const v = fields[key];
        return Array.isArray(v) ? v[0] : v;
      };

      let imagePath = "";
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      if (file) {
        try {
          const result = await cloudinary.uploader.upload(file.filepath, {
            folder: "dailythoughts",
          });
          imagePath = result.secure_url;
        } catch {
          imagePath = "";
        }
      }

      resolve({
        title: get("title") || "",
        date: get("date") || "",
        description: get("description") || "",
        image: imagePath || get("image") || "",
      });
    });
  });
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(204).end();

  const col = await getCollection();

  if (req.method === "GET") {
    const blogs = await col.find({}).sort({ _id: -1 }).toArray();
    return res.status(200).json(blogs.map(({ _id, ...b }) => b));
  }

  if (req.method === "POST") {
    let title, date, description, image;

    const ct = req.headers["content-type"] || "";
    if (ct.includes("multipart/form-data")) {
      try {
        ({ title, date, description, image } = await parseMultipart(req));
      } catch {
        return res.status(500).json({ error: "Failed to parse form data." });
      }
    } else {
      ({ title, date, description, image } = await readJsonBody(req));
    }

    if (!title || !date || !description) {
      return res.status(400).json({ error: "Title, date, and description are required." });
    }

    const newBlog = {
      id: Date.now().toString(),
      title: title.trim(),
      date,
      description: description.trim(),
      image: image ? image.trim() : "",
    };

    await col.insertOne(newBlog);
    const { _id, ...blog } = newBlog;
    return res.status(201).json(blog);
  }

  return res.status(405).json({ error: "Method not allowed." });
}
