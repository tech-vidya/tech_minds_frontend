import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const navItems = [
  { to: "/creator/dashboard", label: "Dashboard", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/creator/courses", label: "My Courses", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { to: "/creator/submissions", label: "Submissions", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { to: "/creator/analytics", label: "Analytics", d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { to: "/creator/wallet", label: "Wallet", d: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
  { to: "/creator/coupons", label: "Coupons", d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" },
  { to: "/creator/certificates", label: "Certificates", d: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
];

function SidebarContent({ onClose, user, logout }) {
  return (
    <div className="flex flex-col h-full w-64 bg-gray-900 border-r border-gray-800">
      <div className="h-16 flex items-center px-6 border-b border-gray-800 gap-3">
        <Link to="/" className="text-xl font-bold text-white">Tech Minds <span className="text-teal-400 text-sm font-normal">Studio</span></Link>
        {onClose && <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-teal-900/60 text-teal-300" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.d}/></svg>
            {item.label}
          </NavLink>
        ))}
        <div className="pt-2 mt-2 border-t border-gray-800">
          <Link to="/creator/courses/new" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-teal-400 hover:bg-teal-900/40 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4"/></svg>
            New Course
          </Link>
        </div>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-teal-900 flex items-center justify-center text-sm font-bold text-teal-300">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <span className="text-xs text-teal-400">Creator</span>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function CreatorLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><SidebarContent user={user} logout={logout}/></div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden"/>
            <motion.div initial={{x:-256}} animate={{x:0}} exit={{x:-256}} transition={{type:"spring",damping:30,stiffness:300}} className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <SidebarContent onClose={()=>setOpen(false)} user={user} logout={logout}/>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="lg:hidden h-16 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-4">
          <button onClick={()=>setOpen(true)} className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg></button>
          <span className="font-bold text-white">Studio</span>
        </div>
        <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full"><Outlet /></main>
      </div>
    </div>
  );
}
