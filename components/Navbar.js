import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-milonga text-navy text-2xl tracking-wide hover:opacity-80 transition-opacity">
          DailyThoughts
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-8">
          <Link
            href="/"
            className={`font-poppins text-sm font-medium transition-colors ${
              router.pathname === "/"
                ? "text-navy border-b-2 border-navy pb-0.5"
                : "text-gray-500 hover:text-navy"
            }`}
          >
            All Posts
          </Link>
          <Link
            href="/add"
            className="font-poppins text-sm font-medium bg-navy text-white px-5 py-2 rounded-full hover:bg-navy-dark transition-colors"
          >
            Write a Post
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="sm:hidden text-navy p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="font-poppins text-sm font-medium text-gray-700 hover:text-navy"
          >
            All Posts
          </Link>
          <Link
            href="/add"
            onClick={() => setMenuOpen(false)}
            className="font-poppins text-sm font-medium bg-navy text-white px-5 py-2 rounded-full text-center hover:bg-navy-dark transition-colors"
          >
            Write a Post
          </Link>
        </div>
      )}
    </nav>
  );
}