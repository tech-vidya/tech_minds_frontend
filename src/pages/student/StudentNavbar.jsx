// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import useAuth from "../../hooks/useAuth";

// const navLinks = [
//   { to: "/student/dashboard", icon: "🏠", label: "Dashboard" },
//   { to: "/courses",           icon: "🔭", label: "Explore" },
//   { to: "/student/my-courses",icon: "📚", label: "My Learning" },
//   { to: "/student/certificates", icon: "🏆", label: "Certificates" },
//   { to: "/student/profile",   icon: "👤", label: "Profile" },
// ];

// export default function StudentNavbar() {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const initials = user?.name
//     ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
//     : "ST";

//   return (
//     <>
//       {/* ── Top Bar ─────────────────────────────────────────────────── */}
//       <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-16 flex items-center px-4 sm:px-6 gap-4">
//         {/* Mobile menu toggle */}
//         <button
//           onClick={() => setSidebarOpen(true)}
//           className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300"
//           aria-label="Open menu"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>

//         {/* Logo */}
//         <Link to="/student/dashboard" className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mr-auto lg:hidden">
//           Tech Minds
//         </Link>

//         {/* Right side */}
//         <div className="ml-auto flex items-center gap-3">
//           {/* Browse courses shortcut */}
//           <Link
//             to="/courses"
//             className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
//           >
//             <span>🔭</span> Explore
//           </Link>

//           {/* Avatar + name */}
//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
//               {initials}
//             </div>
//             <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
//               {user?.name?.split(" ")[0]}
//             </span>
//           </div>
//         </div>
//       </header>

//       {/* ── Sidebar (desktop — always visible) ──────────────────────── */}
//       <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-60 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 z-20 pt-0">
//         {/* Logo */}
//         <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
//           <Link to="/student/dashboard" className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
//             Tech Minds
//           </Link>
//         </div>

//         {/* Nav links */}
//         <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//           {navLinks.map(({ to, icon, label }) => {
//             const active = location.pathname === to;
//             return (
//               <Link
//                 key={to}
//                 to={to}
//                 className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
//                   active
//                     ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
//                     : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
//                 }`}
//               >
//                 <span className="text-base">{icon}</span>
//                 {label}
//                 {active && (
//                   <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
//                 )}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* User footer */}
//         <div className="px-3 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800">
//           <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
//             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
//               {initials}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
//               <p className="text-xs text-gray-400 truncate">{user?.email}</p>
//             </div>
//           </div>
//           <button
//             onClick={logout}
//             className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-red-500 dark:hover:text-red-400 transition-all"
//           >
//             <span>🚪</span> Sign out
//           </button>
//         </div>
//       </aside>

//       {/* ── Mobile sidebar overlay ───────────────────────────────────── */}
//       <AnimatePresence>
//         {sidebarOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => setSidebarOpen(false)}
//               className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
//             />
//             {/* Drawer */}
//             <motion.aside
//               initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
//               transition={{ type: "spring", damping: 28, stiffness: 300 }}
//               className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-950 z-50 flex flex-col lg:hidden shadow-2xl"
//             >
//               <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 dark:border-gray-800">
//                 <Link to="/student/dashboard" className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
//                   Tech Minds
//                 </Link>
//                 <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//                 {navLinks.map(({ to, icon, label }) => {
//                   const active = location.pathname === to;
//                   return (
//                     <Link
//                       key={to}
//                       to={to}
//                       onClick={() => setSidebarOpen(false)}
//                       className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
//                         active
//                           ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
//                           : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
//                       }`}
//                     >
//                       <span className="text-base">{icon}</span>
//                       {label}
//                     </Link>
//                   );
//                 })}
//               </nav>

//               <div className="px-3 pb-5 pt-2 border-t border-gray-100 dark:border-gray-800">
//                 <div className="flex items-center gap-3 px-3 py-2.5">
//                   <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
//                     {initials}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
//                     <p className="text-xs text-gray-400 truncate">{user?.email}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={logout}
//                   className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-red-500 transition-all"
//                 >
//                   <span>🚪</span> Sign out
//                 </button>
//               </div>
//             </motion.aside>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }




