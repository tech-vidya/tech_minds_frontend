import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import StudentRoutes from "./StudentRoutes";
import CreatorRoutes from "./CreatorRoutes";
import AdminRoutes from "./AdminRoutes";

// ── Page-level lazy imports ────────────────────────────────────────────────────

// Auth pages
const Landing = lazy(() => import("../pages/Landing"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

// Student pages
const StudentDashboard = lazy(() => import("../pages/student/Dashboard"));
const StudentCourses = lazy(() => import("../pages/student/MyCourses"));
const CoursePlayer = lazy(() => import("../pages/student/CoursePlayer"));
const StudentProfile = lazy(() => import("../pages/student/Profile"));

// Creator pages
const CreatorDashboard = lazy(() => import("../pages/creator/Dashboard"));
const MyCourses = lazy(() => import("../pages/creator/MyCourses"));
const CourseBuilder = lazy(() => import("../pages/creator/CourseBuilder"));
const LessonEditor = lazy(() => import("../pages/creator/LessonEditor"));
const QuizBuilder = lazy(() => import("../pages/creator/QuizBuilder"));
const AssignmentBuilder = lazy(
  () => import("../pages/creator/AssignmentBuilder"),
);
const Submissions = lazy(() => import("../pages/creator/Submissions"));
const CreatorAnalytics = lazy(() => import("../pages/creator/Analytics"));

// Admin pages
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const CourseManagement = lazy(() => import("../pages/admin/CourseManagement"));
const AdminSettings = lazy(() => import("../pages/admin/Settings"));

// Shared
const CourseCatalogue = lazy(() => import("../pages/CourseCatalogue"));
const CourseDetail = lazy(() => import("../pages/CourseDetail"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const CoursesLandingPage = lazy(() => import("../pages/CoursesLandingPage"));

// ── Full-page suspense fallback ────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* ── Public open routes (no auth needed, no redirect) ──────────────── */}
      <Route path="/" element={<Landing />} />
      <Route path="/courses" element={<CourseCatalogue />} />
      <Route path="/courses/:slug" element={<CourseDetail />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* <Route path="/browse-courses" element={<CoursesLandingPage />} /> */}
      
      {/* ── Public auth routes (redirect to dashboard if already logged in) ── */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Email verification is public — token does the auth */}
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* ── Student routes ────────────────────────────────────────────────── */}
      <Route element={<StudentRoutes />}>
      <Route path="/" element={<Landing />} />
      
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/my-courses" element={<StudentCourses />} />
        <Route
          path="/student/course/:courseId/learn"
          element={<CoursePlayer />}
        />
        <Route path="/student/profile" element={<StudentProfile />} />
      </Route>

      {/* ── Creator routes ────────────────────────────────────────────────── */}
      <Route element={<CreatorRoutes />}>
        <Route path="/creator/dashboard" element={<CreatorDashboard />} />
        <Route path="/creator/courses" element={<MyCourses />} />
        <Route path="/creator/courses/new" element={<CourseBuilder />} />
        <Route
          path="/creator/courses/:courseId/edit"
          element={<CourseBuilder />}
        />
        <Route
          path="/creator/courses/:courseId/lessons/:lessonId"
          element={<LessonEditor />}
        />
        <Route
          path="/creator/courses/:courseId/lessons/:lessonId/quiz"
          element={<QuizBuilder />}
        />
        <Route
          path="/creator/courses/:courseId/lessons/:lessonId/assignment"
          element={<AssignmentBuilder />}
        />
        <Route path="/creator/submissions" element={<Submissions />} />
        <Route path="/creator/analytics" element={<CreatorAnalytics />} />
      </Route>

      {/* ── Admin routes ──────────────────────────────────────────────────── */}
      <Route element={<AdminRoutes />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/courses" element={<CourseManagement />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* ── Fallback ──────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRouter;
