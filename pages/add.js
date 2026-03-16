import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AddPost() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", date: "", description: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.date || !form.description) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }
      router.push("/");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 font-poppins text-sm text-gray-400 hover:text-navy transition-colors mb-10 fade-up">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Posts
      </Link>

      {/* Heading */}
      <div className="mb-10 fade-up fade-up-delay-1">
        <h1 className="font-milonga text-navy text-4xl mb-2">Write a Post</h1>
        <p className="font-poppins text-sm text-gray-400">
          Share your thoughts with the world. No account needed.
        </p>
      </div>

      {/* Toggle Preview */}
      <div className="flex gap-2 mb-8 fade-up fade-up-delay-2">
        <button
          onClick={() => setPreview(false)}
          className={`font-poppins text-sm px-4 py-1.5 rounded-full transition-colors ${
            !preview ? "bg-navy text-white" : "text-gray-400 hover:text-navy"
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setPreview(true)}
          className={`font-poppins text-sm px-4 py-1.5 rounded-full transition-colors ${
            preview ? "bg-navy text-white" : "text-gray-400 hover:text-navy"
          }`}
        >
          Preview
        </button>
      </div>

      {!preview ? (
        /* Form */
        <form onSubmit={handleSubmit} className="space-y-6 fade-up fade-up-delay-3">
          {/* Title */}
          <div>
            <label className="font-poppins text-xs font-medium text-gray-500 uppercase tracking-widest block mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Your post title..."
              className="w-full font-prata text-navy text-xl border-b-2 border-gray-100 focus:border-navy pb-2 focus:outline-none transition-colors bg-transparent placeholder-gray-200"
            />
          </div>

          {/* Date */}
          <div>
            <label className="font-poppins text-xs font-medium text-gray-500 uppercase tracking-widest block mb-2">
              Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date || today}
              onChange={handleChange}
              max={today}
              className="font-poppins text-sm text-gray-700 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition cursor-pointer"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="font-poppins text-xs font-medium text-gray-500 uppercase tracking-widest block mb-2">
              Image URL <span className="text-gray-300">(optional)</span>
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full font-poppins text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition"
            />
            {form.image && (
              <div className="mt-3 rounded-xl overflow-hidden h-40 bg-gray-50">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="font-poppins text-xs font-medium text-gray-500 uppercase tracking-widest block mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write your thoughts here..."
              rows={7}
              className="w-full font-poppins text-sm text-gray-700 leading-relaxed border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="font-poppins text-sm text-red-400 bg-red-50 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-poppins font-medium text-sm bg-navy text-white py-3.5 rounded-full hover:bg-navy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Publishing...
              </>
            ) : (
              "Publish Post"
            )}
          </button>
        </form>
      ) : (
        /* Preview */
        <div className="fade-up">
          {form.image && (
            <div className="rounded-2xl overflow-hidden h-64 mb-8 bg-gray-50">
              <img src={form.image} alt={form.title} className="w-full h-full object-cover" />
            </div>
          )}
          <p className="font-poppins text-xs text-gray-400 uppercase tracking-widest mb-2">
            {form.date ? new Date(form.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Date not set"}
          </p>
          <h2 className="font-prata text-navy text-3xl mb-5 leading-tight">
            {form.title || <span className="text-gray-200">Untitled Post</span>}
          </h2>
          <p className="font-poppins text-gray-600 leading-8 text-base whitespace-pre-wrap">
            {form.description || <span className="text-gray-200">No description yet.</span>}
          </p>
        </div>
      )}
    </div>
  );
}