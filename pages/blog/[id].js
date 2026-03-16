import Link from "next/link";
import fs from "fs";
import path from "path";

export default function BlogPost({ blog }) {
  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center fade-up">
        <h1 className="font-prata text-3xl text-gray-300 mb-4">Post not found.</h1>
        <Link href="/" className="font-poppins text-sm text-navy hover:underline">
          ← Back to all posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-poppins text-sm text-gray-400 hover:text-navy transition-colors mb-10 fade-up"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Posts
      </Link>

      {/* Cover Image */}
      {blog.image && (
        <div className="rounded-3xl overflow-hidden mb-10 h-72 bg-gray-50 fade-up fade-up-delay-1">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/800x400/124179/ffffff?text=DailyThoughts`;
            }}
          />
        </div>
      )}

      {/* Meta */}
      <p className="font-poppins text-xs text-gray-400 uppercase tracking-widest mb-3 fade-up fade-up-delay-2">
        {formatDate(blog.date)}
      </p>

      {/* Title */}
      <h1 className="font-prata text-navy text-4xl sm:text-5xl leading-tight mb-8 fade-up fade-up-delay-3">
        {blog.title}
      </h1>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8 fade-up fade-up-delay-4">
        <div className="w-8 h-0.5 bg-navy" />
        <div className="w-2 h-0.5 bg-navy/40" />
      </div>

      {/* Body */}
      <div className="fade-up fade-up-delay-5">
        <p className="font-poppins text-gray-600 text-base leading-8 whitespace-pre-wrap">
          {blog.description}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="mt-16 pt-10 border-t border-gray-100 fade-up fade-up-delay-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-prata text-navy text-lg mb-1">Have something to share?</p>
          <p className="font-poppins text-sm text-gray-400">Write your own post — no account needed.</p>
        </div>
        <Link
          href="/add"
          className="font-poppins text-sm font-medium bg-navy text-white px-6 py-2.5 rounded-full hover:bg-navy-dark transition-colors whitespace-nowrap"
        >
          Write a Post →
        </Link>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function getServerSideProps({ params }) {
  const dataFilePath = path.join(process.cwd(), "data", "blog.json");
  let blog = null;
  try {
    const raw = fs.readFileSync(dataFilePath, "utf-8");
    const blogs = JSON.parse(raw);
    blog = blogs.find((b) => b.id === params.id) || null;
  } catch {
    blog = null;
  }
  return { props: { blog } };
}
