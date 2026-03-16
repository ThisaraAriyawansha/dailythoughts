const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "12345678";
const SESSION_TOKEN = "dt_admin_session_secret";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  const { email, password } = req.body || {};

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.setHeader(
      "Set-Cookie",
      `admin_token=${SESSION_TOKEN}; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400`
    );
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: "Invalid email or password." });
}
