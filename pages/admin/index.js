import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getCollection } from "@/lib/db";

const SESSION_TOKEN = "dt_admin_session_secret";

function parseCookies(cookieStr) {
  const cookies = {};
  (cookieStr || "").split(";").forEach((c) => {
    const [k, ...v] = c.split("=");
    cookies[k.trim()] = v.join("=").trim();
  });
  return cookies;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminDashboard({ initialBlogs }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard — DailyThoughts</title>
      </Head>
      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-poppins text-xs font-medium tracking-[0.2em] uppercase text-navy/60 mb-1">
              Admin Panel
            </p>
            <h1 className="font-milonga text-navy text-4xl">Manage Posts</h1>
          </div>
          <button
            onClick={handleLogout}
            className="font-poppins text-sm font-medium border border-gray-200 text-gray-500 px-5 py-2 rounded-full hover:border-navy hover:text-navy transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 rounded-2xl px-6 py-4 mb-10 flex items-center gap-3">
          <span className="font-poppins text-sm text-gray-500">Total posts:</span>
          <span className="font-prata text-navy text-lg">{blogs.length}</span>
        </div>

        {/* Blog List */}
        {blogs.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-prata text-2xl text-gray-300 mb-3">No posts.</p>
            <p className="font-poppins text-sm text-gray-400">All blogs have been deleted.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-50">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                      <span className="font-milonga text-white text-xs opacity-40">DT</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-poppins text-xs text-gray-400 mb-1 uppercase tracking-wide">
                    {formatDate(blog.date)}
                  </p>
                  <h2 className="font-prata text-navy text-base leading-snug truncate">
                    {blog.title}
                  </h2>
                  <p className="font-poppins text-xs text-gray-400 mt-1 truncate">
                    ID: {blog.id}
                  </p>
                </div>

                {/* Delete */}
                <div className="shrink-0">
                  {confirmId === blog.id ? (
                    <div className="flex items-center gap-2">
                      <span className="font-poppins text-xs text-gray-400">Sure?</span>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        disabled={deletingId === blog.id}
                        className="font-poppins text-xs font-medium bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
                      >
                        {deletingId === blog.id ? "Deleting..." : "Yes, delete"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="font-poppins text-xs text-gray-400 px-3 py-1.5 rounded-lg hover:text-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(blog.id)}
                      className="font-poppins text-xs font-medium text-red-400 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context.req.headers.cookie);

  if (cookies.admin_token !== SESSION_TOKEN) {
    return { redirect: { destination: "/admin/login", permanent: false } };
  }

  try {
    const col = await getCollection();
    const blogs = await col.find({}).sort({ _id: -1 }).toArray();
    return { props: { initialBlogs: blogs.map(({ _id, ...b }) => b) } };
  } catch {
    return { props: { initialBlogs: [] } };
  }
}
