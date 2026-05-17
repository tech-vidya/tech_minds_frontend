// import { useState } from "react";
// import { Outlet, NavLink, Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import useAuth from "../../hooks/useAuth";

// const navItems = [
//   { to: "/student/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
//   { to: "/student/my-courses", label: "My Courses", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
//   { to: "/courses", label: "Browse Courses", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
//   { to: "/student/profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
// ];

// function NavIcon({ path }) {
//   return (
//     <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
//     </svg>
//   );
// }

// function SidebarContent({ onClose, user, logout }) {
//   return (
//     <div className="flex flex-col h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
    
//       <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800 gap-3">
//         <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Tech Minds</Link>
//         {onClose && (
//           <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
//           </button>
//         )}
//       </div>
//       <nav className="flex-1 px-3 py-4 space-y-0.5">
//         {navItems.map((item) => (
//           <NavLink key={item.to} to={item.to} onClick={onClose}
//             className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}`}
//           >
//             <NavIcon path={item.icon} />{item.label}
//           </NavLink>
//         ))}
//       </nav>
//       <div className="p-4 border-t border-gray-100 dark:border-gray-800">
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-300">
//             {user?.name?.charAt(0).toUpperCase()}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
//             <p className="text-xs text-gray-400 truncate">{user?.email}</p>
//           </div>
//         </div>
//         <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-400 rounded-xl transition">
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
//           Sign out
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function StudentLayout() {
//   const { user, logout } = useAuth();
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
//       <div className="hidden lg:flex flex-shrink-0"><SidebarContent user={user} logout={logout} /></div>
//       <AnimatePresence>
//         {open && (
//           <>
//             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden"/>
//             <motion.div initial={{x:-256}} animate={{x:0}} exit={{x:-256}} transition={{type:"spring",damping:30,stiffness:300}} className="fixed left-0 top-0 h-full z-50 lg:hidden">
//               <SidebarContent onClose={()=>setOpen(false)} user={user} logout={logout}/>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <div className="lg:hidden h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 gap-4">
//           <button onClick={()=>setOpen(true)} className="text-gray-500 hover:text-gray-700">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
//           </button>
//           <span className="font-bold text-indigo-600 text-lg">Tech Minds</span>
//         </div>
//         <main className="flex-1 overflow-y-auto"><Outlet /></main>
//       </div>
//     </div>
//   );
// }

















import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const navItems = [
  {
    to: "/student/dashboard",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    to: "/student/my-courses",
    label: "My Courses",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    to: "/courses",
    label: "Browse Courses",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    to: "/student/profile",
    label: "Profile",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
];

function NavIcon({ path }) {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
    </svg>
  );
}

function SidebarContent({ onClose, user, logout }) {
  return (
    <div className="flex flex-col h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">

      {/* HEADER */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
        >
          Tech Minds
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition
              ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`
            }
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <NavIcon path={item.icon} />
            </div>

            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* USER SECTION */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 mb-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950 rounded-xl transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">  {/* 👈 HERE */}
      
      {/* SIDEBAR */}
      <div className="hidden lg:flex w-64 shrink-0">
        <SidebarContent user={user} logout={logout} />
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 h-full z-50 lg:hidden"
            >
              <SidebarContent
                onClose={() => setOpen(false)}
                user={user}
                logout={logout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP MOBILE BAR */}
        <div className="lg:hidden h-16 flex items-center px-4 border-b">
          <button onClick={() => setOpen(true)}>☰</button>
          <span className="ml-3 font-bold">Tech Minds</span>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="w-full max-w-7xl mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}