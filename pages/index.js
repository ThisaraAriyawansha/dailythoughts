import { useState } from "react";
import Head from "next/head";
import BlogCard from "@/components/BlogCard";
import fs from "fs";
import path from "path";

export default function Home({ initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [search, setSearch] = useState("");

  const filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <Head>
      <title>DailyThoughts — Share Your Thoughts</title>
      <meta name="description" content="A quiet corner of the internet for ideas worth sharing. No account, no noise — just words. Open platform for everyone." />
      <meta name="keywords" content="blog, thoughts, writing, open platform, daily thoughts" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="DailyThoughts — Share Your Thoughts" />
      <meta property="og:description" content="A quiet corner of the internet for ideas worth sharing. No account, no noise — just words." />
      <meta property="og:image" content="/logo_124179-bg_remove.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="DailyThoughts — Share Your Thoughts" />
      <meta name="twitter:description" content="A quiet corner of the internet for ideas worth sharing. No account, no noise — just words." />
      <meta name="twitter:image" content="/logo_124179-bg_remove.png" />
    </Head>
    <div className="max-w-5xl mx-auto px-6 py-14">
      {/* Hero */}
      <div className="mb-14 fade-up">
        <p className="font-poppins text-xs font-medium tracking-[0.2em] uppercase text-navy/60 mb-3">
          Open · Free · For Everyone
        </p>
        <h1 className="font-milonga text-navy text-5xl sm:text-6xl leading-tight mb-5">
          Daily<br />Thoughts.
        </h1>
        <p className="font-poppins text-gray-500 text-base max-w-md leading-relaxed">
          A quiet corner of the internet for ideas worth sharing. No account, no noise — just words.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-10 fade-up fade-up-delay-1">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="font-poppins text-xs text-gray-300 tracking-widest uppercase">Latest Posts</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Search */}
      <div className="mb-10 fade-up fade-up-delay-2">
        <div className="relative max-w-sm">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-11 pr-4 py-2.5 font-poppins text-sm border border-gray-200 rounded-full focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition"
          />
        </div>
      </div>

      {/* Blog Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 fade-up">
          <p className="font-prata text-2xl text-gray-300 mb-3">No posts yet.</p>
          <p className="font-poppins text-sm text-gray-400">Be the first to share a thought.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} index={i} />
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export async function getServerSideProps() {
  const dataFilePath = path.join(process.cwd(), "data", "blog.json");
  let blogs = [];
  try {
    const raw = fs.readFileSync(dataFilePath, "utf-8");
    blogs = JSON.parse(raw).reverse();
  } catch {
    blogs = [];
  }
  return { props: { initialBlogs: blogs } };
}