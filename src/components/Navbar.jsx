// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//         <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
//           Tech Minds
//         </Link>
//         <div className="flex items-center gap-3">
//           <Link to="/browse-courses" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block">
//             Browse courses
//           </Link>
//           <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
//             Sign in
//           </Link>
//           <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
//             Get started free
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
        >
          Tech Minds
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <Link
            to="/techmind-courses"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block"
          >
            courses
          </Link>
          <Link
            to="/contact"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block"
          >
            Contact
          </Link>
          <Link
            to="/about"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block"
          >
            About us
          </Link>

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl"
              >
                Get started
              </Link>
            </>
          )}

          {/* LOGGED IN USER */}
          {user && (
            <div className="relative" ref={menuRef}>
              {/* AVATAR BUTTON */}
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2"
              >
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                    {user.name?.charAt(0)}
                  </div>
                )}

                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name}
                </span>
              </button>

              {/* DROPDOWN MENU */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-52 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        navigate("/student/profile");
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/student/dashboard");
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        navigate("/student/my-courses");
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      My Courses
                    </button>

                    <button
                      onClick={() => {
                        navigate("/settings");
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Settings
                    </button>

                    <div className="border-t dark:border-gray-800" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
