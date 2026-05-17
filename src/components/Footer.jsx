import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-gray-800">

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            Tech Minds
          </h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Learn real-world skills with practical courses, expert mentors,
            and project-based learning.
          </p>

          <div className="flex gap-3 mt-5">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm cursor-pointer hover:scale-110 transition">
              f
            </div>
            <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm cursor-pointer hover:scale-110 transition">
              t
            </div>
            <div className="w-9 h-9 rounded-full bg-pink-600 flex items-center justify-center text-white text-sm cursor-pointer hover:scale-110 transition">
              ig
            </div>
          </div>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/techmind-courses" className="hover:text-white">Courses</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="text-white font-semibold mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Development</li>
            <li className="hover:text-white cursor-pointer">Design</li>
            <li className="hover:text-white cursor-pointer">Marketing</li>
            <li className="hover:text-white cursor-pointer">Business</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm text-gray-400">
            Get latest courses & updates.
          </p>

          <div className="mt-4 flex">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-3 py-2 rounded-l-xl bg-gray-900 border border-gray-700 text-sm outline-none"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded-r-xl text-sm font-semibold text-white">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="max-w-7xl mx-auto px-4 mt-12 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Tech Minds. All rights reserved.</p>

        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/terms" className="hover:text-white">Terms</Link>
        </div>
      </div>
    </footer>
  );
}