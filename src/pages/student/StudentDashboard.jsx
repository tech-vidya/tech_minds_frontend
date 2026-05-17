import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import { fetchMyEnrollments } from "../../api/services/course.service";
import Navbar from "../../components/Navbar";

const card = "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700";

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`${card} p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
}

function CourseCard({ enrollment }) {
  const { course, progressPercent, lastAccessedLesson } = enrollment;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`${card} overflow-hidden hover:shadow-md transition-shadow`}>
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
        {course.thumbnail?.url ? (
          <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
        )}
        {progressPercent === 100 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            Completed ✓
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          by {course.creator?.name}
        </p>
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progressPercent || 0}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent || 0}%` }} />
          </div>
        </div>
        <Link
          to={lastAccessedLesson
            ? `/student/learn/${course._id}/lesson/${lastAccessedLesson}`
            : `/student/learn/${course._id}`}
          className="w-full block text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition">
          {progressPercent > 0 ? "Continue" : "Start learning"}
        </Link>
      </div>
    </motion.div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyEnrollments()
      .then(d => setEnrollments(d.enrollments || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const completed = enrollments.filter(e => e.isCompleted).length;
  const inProgress = enrollments.filter(e => !e.isCompleted && (e.progressPercent || 0) > 0).length;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* <Navbar/> */}
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Keep going — every lesson brings you closer to your goal.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Enrolled" value={enrollments.length} icon="📚" color="bg-indigo-50 dark:bg-indigo-950" />
        <StatCard label="Completed" value={completed} icon="✅" color="bg-green-50 dark:bg-green-950" />
        <StatCard label="In Progress" value={inProgress} icon="⏳" color="bg-yellow-50 dark:bg-yellow-950" />
        <Link to="/student/certificate/:courseId">
          <StatCard label="Certificates" value={completed} icon="🏆" color="bg-purple-50 dark:bg-purple-950" />
        </Link>
      </div>

      {/* Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Learning</h2>
          <Link to="/courses" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Browse more →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`${card} overflow-hidden animate-pulse`}>
                <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className={`${card} p-12 text-center`}>
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition">
              Explore courses →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map(e => <CourseCard key={e._id} enrollment={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}
































// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import useAuth from "../../hooks/useAuth";
// import { fetchMyEnrollments } from "../../api/services/course.service";
// import StudentNavbar from "./StudentNavbar";

// // ─── Animation variants ────────────────────────────────────────────────────
// const fadeUp = {
//   initial: { opacity: 0, y: 16 },
//   animate: i => ({
//     opacity: 1, y: 0,
//     transition: { duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
//   }),
// };

// // ─── Stat Card ─────────────────────────────────────────────────────────────
// function StatCard({ label, value, icon, gradient, index }) {
//   return (
//     <motion.div
//       custom={index}
//       variants={fadeUp}
//       initial="initial"
//       animate="animate"
//       className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow"
//     >
//       <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-gradient-to-br ${gradient}`}>
//         {icon}
//       </div>
//       <div>
//         <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
//         <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
//       </div>
//     </motion.div>
//   );
// }

// // ─── Course Card ───────────────────────────────────────────────────────────
// function CourseCard({ enrollment, index }) {
//   const { course, progressPercent, lastAccessedLesson } = enrollment;
//   const progress = progressPercent || 0;
//   const isCompleted = progress === 100;
//   const isStarted = progress > 0;

//   return (
//     <motion.div
//       custom={index}
//       variants={fadeUp}
//       initial="initial"
//       animate="animate"
//       className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all group"
//     >
//       {/* Thumbnail */}
//       <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
//         {course.thumbnail?.url ? (
//           <img
//             src={course.thumbnail.url}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50">
//             📚
//           </div>
//         )}
//         {/* Status badge */}
//         {isCompleted && (
//           <div className="absolute top-2.5 right-2.5 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
//             Completed ✓
//           </div>
//         )}
//         {!isCompleted && isStarted && (
//           <div className="absolute top-2.5 right-2.5 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
//             In Progress
//           </div>
//         )}
//       </div>

//       <div className="p-4">
//         <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2">
//           {course.title}
//         </h3>
//         <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
//           by {course.creator?.name}
//         </p>

//         {/* Progress */}
//         <div className="mb-4">
//           <div className="flex justify-between items-center mb-1.5">
//             <span className="text-xs text-gray-400">Progress</span>
//             <span className={`text-xs font-semibold ${isCompleted ? "text-green-500" : "text-indigo-500"}`}>
//               {progress}%
//             </span>
//           </div>
//           <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${progress}%` }}
//               transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
//               className={`h-1.5 rounded-full ${isCompleted ? "bg-green-500" : "bg-indigo-500"}`}
//             />
//           </div>
//         </div>

//         <Link
//           to={
//             lastAccessedLesson
//               ? `/student/learn/${course._id}/lesson/${lastAccessedLesson}`
//               : `/student/learn/${course._id}`
//           }
//           className={`w-full block text-center py-2 text-sm font-semibold rounded-xl transition ${
//             isCompleted
//               ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/60"
//               : "bg-indigo-600 hover:bg-indigo-700 text-white"
//           }`}
//         >
//           {isCompleted ? "Review course" : isStarted ? "Continue →" : "Start learning →"}
//         </Link>
//       </div>
//     </motion.div>
//   );
// }

// // ─── Skeleton ──────────────────────────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
//       <div className="aspect-video bg-gray-100 dark:bg-gray-800" />
//       <div className="p-4 space-y-2.5">
//         <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-4/5" />
//         <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-2/5" />
//         <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full w-full mt-4" />
//         <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded-xl w-full mt-2" />
//       </div>
//     </div>
//   );
// }

// // ─── Empty State ───────────────────────────────────────────────────────────
// function EmptyState() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-14 text-center"
//     >
//       <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-3xl mx-auto mb-4">
//         🎓
//       </div>
//       <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
//         No courses yet
//       </h3>
//       <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-xs mx-auto">
//         You haven't enrolled in any courses yet. Explore our library and start learning today.
//       </p>
//       <Link
//         to="/courses"
//         className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
//       >
//         Explore courses →
//       </Link>
//     </motion.div>
//   );
// }

// // ─── Main Dashboard ────────────────────────────────────────────────────────
// export default function StudentDashboard() {
//   const { user } = useAuth();
//   const [enrollments, setEnrollments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchMyEnrollments()
//       .then(d => setEnrollments(d.enrollments || []))
//       .catch(() => {})
//       .finally(() => setIsLoading(false));
//   }, []);

//   const completed  = enrollments.filter(e => e.isCompleted).length;
//   const inProgress = enrollments.filter(e => !e.isCompleted && (e.progressPercent || 0) > 0).length;
//   const avgProgress = enrollments.length
//     ? Math.round(enrollments.reduce((acc, e) => acc + (e.progressPercent || 0), 0) / enrollments.length)
//     : 0;

//   return (
//     // lg:pl-60 offsets the fixed 240px sidebar on desktop
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 lg:pl-60">
//       <StudentNavbar />

//       <main className="p-5 sm:p-7 lg:p-8 space-y-8 max-w-6xl">

//         {/* ── Header ─────────────────────────────────────────────────── */}
//         <motion.div
//           initial={{ opacity: 0, y: -12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="flex items-start justify-between gap-4 flex-wrap"
//         >
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
//               Welcome back, {user?.name?.split(" ")[0]} 👋
//             </h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//               Keep going — every lesson brings you closer to your goal.
//             </p>
//           </div>
//           <Link
//             to="/courses"
//             className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition flex-shrink-0"
//           >
//             + Enroll in a course
//           </Link>
//         </motion.div>

//         {/* ── Stats ──────────────────────────────────────────────────── */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard index={0} label="Total enrolled"  value={enrollments.length} icon="📚" gradient="from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950" />
//           <StatCard index={1} label="Completed"       value={completed}          icon="✅" gradient="from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950" />
//           <StatCard index={2} label="In progress"     value={inProgress}         icon="⏳" gradient="from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950" />
//           <Link to={`/student/certificates`} className="block">
//             <StatCard index={3} label="Certificates"  value={completed}          icon="🏆" gradient="from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950" />
//           </Link>
//         </div>

//         {/* ── Overall progress banner ─────────────────────────────────── */}
//         {enrollments.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
//           >
//             <div className="flex-1">
//               <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-1">Overall progress</p>
//               <p className="text-white text-lg font-bold">
//                 {avgProgress}% average across all your courses
//               </p>
//               <div className="mt-3 w-full bg-white/20 rounded-full h-2 overflow-hidden">
//                 <motion.div
//                   initial={{ width: 0 }}
//                   animate={{ width: `${avgProgress}%` }}
//                   transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
//                   className="h-2 bg-white rounded-full"
//                 />
//               </div>
//             </div>
//             <Link
//               to="/student/certificates"
//               className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition flex-shrink-0"
//             >
//               View certificates →
//             </Link>
//           </motion.div>
//         )}

//         {/* ── My Learning ────────────────────────────────────────────── */}
//         <div>
//           <div className="flex items-center justify-between mb-5">
//             <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
//               My Learning
//             </h2>
//             <Link to="/courses" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
//               Browse more →
//             </Link>
//           </div>

//           {isLoading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
//             </div>
//           ) : enrollments.length === 0 ? (
//             <EmptyState />
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {enrollments.map((e, i) => (
//                 <CourseCard key={e._id} enrollment={e} index={i} />
//               ))}
//             </div>
//           )}
//         </div>

//       </main>
//     </div>
//   );
// }