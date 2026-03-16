import fs from "fs";
import path from "path";
import formidable from "formidable";

const dataFilePath = path.join(process.cwd(), "data", "blog.json");

export const config = {
  api: { bodyParser: false },
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readBlogs() {
  try {
    const raw = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeBlogs(blogs) {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dataFilePath, JSON.stringify(blogs, null, 2), "utf-8");
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
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({ uploadDir, keepExtensions: true, maxFileSize: 5 * 1024 * 1024 });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

      // formidable v3 returns arrays for fields
      const get = (key) => {
        const v = fields[key];
        return Array.isArray(v) ? v[0] : v;
      };

      let imagePath = "";
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      if (file) {
        imagePath = "/uploads/" + path.basename(file.filepath);
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

  if (req.method === "GET") {
    const blogs = readBlogs();
    return res.status(200).json([...blogs].reverse());
  }

  if (req.method === "POST") {
    const contentType = req.headers["content-type"] || "";

    let title, date, description, image;

    if (contentType.includes("multipart/form-data")) {
      // File upload from Postman / mobile app
      try {
        ({ title, date, description, image } = await parseMultipart(req));
      } catch {
        return res.status(500).json({ error: "Failed to parse form data." });
      }
    } else {
      // JSON from web form or external API
      const body = await readJsonBody(req);
      ({ title, date, description, image } = body);
    }

    if (!title || !date || !description) {
      return res.status(400).json({ error: "Title, date, and description are required." });
    }

    const blogs = readBlogs();
    const newBlog = {
      id: Date.now().toString(),
      title: title.trim(),
      date,
      description: description.trim(),
      image: image ? image.trim() : "",
    };

    blogs.push(newBlog);
    writeBlogs(blogs);

    return res.status(201).json(newBlog);
  }

  return res.status(405).json({ error: "Method not allowed." });
}
