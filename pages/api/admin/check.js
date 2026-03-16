const SESSION_TOKEN = "dt_admin_session_secret";

function parseCookies(req) {
  const cookies = {};
  (req.headers.cookie || "").split(";").forEach((c) => {
    const [k, ...v] = c.split("=");
    cookies[k.trim()] = v.join("=").trim();
  });
  return cookies;
}

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed." });

  const cookies = parseCookies(req);
  return res.status(200).json({ isAdmin: cookies.admin_token === SESSION_TOKEN });
}
