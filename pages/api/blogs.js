import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "blog.json");

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

export default function handler(req, res) {
  setCors(res);

  // Preflight request from browsers
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    const blogs = readBlogs();
    return res.status(200).json([...blogs].reverse());
  }

  if (req.method === "POST") {
    const { title, date, description, image } = req.body;

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
