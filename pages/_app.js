import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <Component {...pageProps} />
      </main>
      <footer className="border-t border-gray-100 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-milonga text-navy text-lg tracking-wide">DailyThoughts</span>
          <p className="font-poppins text-xs text-gray-400">
            An open platform. No login required. Share freely.
          </p>
        </div>
      </footer>
    </>
  );
}