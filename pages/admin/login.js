import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login — DailyThoughts</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="font-milonga text-navy text-3xl mb-2">Admin</h1>
            <p className="font-poppins text-sm text-gray-400">Sign in to manage posts</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="mb-5">
              <label className="font-poppins text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                required
                className="w-full px-4 py-2.5 font-poppins text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition"
              />
            </div>

            <div className="mb-6">
              <label className="font-poppins text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 font-poppins text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition"
              />
            </div>

            {error && (
              <p className="font-poppins text-xs text-red-500 mb-4 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white font-poppins text-sm font-medium py-2.5 rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
