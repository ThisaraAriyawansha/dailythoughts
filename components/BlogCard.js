import Link from "next/link";

export default function BlogCard({ blog, index }) {
  const delayClass = `fade-up-delay-${Math.min(index + 1, 6)}`;

  return (
    <Link href={`/blog/${blog.id}`}>
      <article
        className={`group fade-up ${delayClass} bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-navy/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-52 bg-gray-50">
          {blog.image ? (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/800x400/124179/ffffff?text=DailyThoughts`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
              <span className="font-milonga text-white text-2xl opacity-40">DT</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="font-poppins text-xs text-gray-400 mb-2 tracking-wide uppercase">
            {formatDate(blog.date)}
          </p>
          <h2 className="font-prata text-navy text-xl leading-snug mb-3 group-hover:text-navy-light transition-colors line-clamp-2">
            {blog.title}
          </h2>
          <p className="font-poppins text-sm text-gray-500 leading-relaxed line-clamp-3">
            {blog.description}
          </p>
          <div className="mt-4 flex items-center gap-1 text-navy font-poppins text-xs font-medium">
            Read more
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}