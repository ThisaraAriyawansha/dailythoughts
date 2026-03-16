import { useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AddPost() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ title: "", date: today, description: "", image: "" });
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const fileInputRef = useRef(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview instantly
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
    setForm((f) => ({ ...f, image: "" }));
    setImageUploading(true);

    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed.");
      const data = await res.json();
      setForm((f) => ({ ...f, image: data.path }));
    } catch {
      setError("Image upload failed. Please try again.");
      setLocalPreviewUrl("");
    } finally {
      setImageUploading(false);
    }
  }

  function handleRemoveImage() {
    setLocalPreviewUrl("");
    setForm((f) => ({ ...f, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.date || !form.description) {
      setError("Please fill in all required fields.");
      return;
    }
    if (imageUploading) {
      setError("Please wait for the image to finish uploading.");
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

  const displayImage = localPreviewUrl || form.image;

  return (
    <>
    <Head>
      <title>Write a Post — DailyThoughts</title>
      <meta name="description" content="Share your thoughts with the world. No account needed. Write and publish a post on DailyThoughts." />
      <meta name="robots" content="noindex, nofollow" />
    </Head>
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
              value={form.date}
              onChange={handleChange}
              max={today}
              className="font-poppins text-sm text-gray-700 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition cursor-pointer"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-poppins text-xs font-medium text-gray-500 uppercase tracking-widest block mb-2">
              Cover Image <span className="text-gray-300">(optional)</span>
            </label>

            {displayImage ? (
              /* Preview with remove button */
              <div className="relative rounded-2xl overflow-hidden h-48 bg-gray-50">
                <img
                  src={displayImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                {imageUploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="font-poppins text-sm text-navy">Uploading...</span>
                  </div>
                )}
                {!imageUploading && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-500 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              /* Upload button */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-2xl h-36 flex flex-col items-center justify-center gap-2 hover:border-navy/40 hover:bg-navy/5 transition-colors group"
              >
                <svg className="w-8 h-8 text-gray-300 group-hover:text-navy/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-poppins text-sm text-gray-400 group-hover:text-navy/60 transition-colors">
                  Click to browse image
                </span>
                <span className="font-poppins text-xs text-gray-300">JPG, PNG, WebP — max 5 MB</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
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
            disabled={loading || imageUploading}
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
          {displayImage && (
            <div className="rounded-2xl overflow-hidden h-64 mb-8 bg-gray-50">
              <img src={displayImage} alt={form.title} className="w-full h-full object-cover" />
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
    </>
  );
}
