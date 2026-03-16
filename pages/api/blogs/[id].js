import { v2 as cloudinary } from "cloudinary";
import { getCollection } from "@/lib/db";

const SESSION_TOKEN = "dt_admin_session_secret";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function parseCookies(req) {
  const cookies = {};
  (req.headers.cookie || "").split(";").forEach((c) => {
    const [k, ...v] = c.split("=");
    cookies[k.trim()] = v.join("=").trim();
  });
  return cookies;
}

function getCloudinaryPublicId(url) {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed." });

  const cookies = parseCookies(req);
  if (cookies.admin_token !== SESSION_TOKEN) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { id } = req.query;
  const col = await getCollection();

  const blog = await col.findOne({ id });
  if (!blog) return res.status(404).json({ error: "Blog not found." });

  if (blog.image) {
    const publicId = getCloudinaryPublicId(blog.image);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch {
        // ignore cloudinary errors, still delete from DB
      }
    }
  }

  await col.deleteOne({ id });
  return res.status(200).json({ success: true });
}
