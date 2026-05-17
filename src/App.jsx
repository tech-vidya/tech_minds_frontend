import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { refreshAccessToken, fetchCurrentUser } from "./store/slices/authSlice";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";

// Public pages
import LandingPage from "./pages/LandingPage";
import CourseCataloguePage from "./pages/CourseCataloguePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
// import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Student pages
import StudentLayout from "./components/layout/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import CoursePlayerPage from "./pages/student/CoursePlayerPage";
import MyCoursesPage from "./pages/student/MyCoursesPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import CertificatePage from "./pages/student/CertificatePage";

// Creator pages
import CreatorLayout from "./components/layout/CreatorLayout";
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import MyCourses from "./pages/creator/MyCourses";
import CourseBuilder from "./pages/creator/CourseBuilder";
import LessonEditor from "./pages/creator/LessonEditor";
import QuizBuilder from "./pages/creator/QuizBuilder";
import AssignmentBuilder from "./pages/creator/AssignmentBuilder";
import SubmissionsPage from "./pages/creator/SubmissionsPage";
import CreatorAnalytics from "./pages/creator/CreatorAnalytics";
import CreatorWallet from "./pages/creator/CreatorWallet";
import CouponManager from "./pages/creator/CouponManager";
import CertificateManager from "./pages/creator/CertificateManager";

// Admin pages
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CourseManagement from "./pages/admin/CourseManagement";
import CourseApprovals from "./pages/admin/CourseApprovals";
import CategoryManagement from "./pages/admin/CategoryManagement";
import RevenueReports from "./pages/admin/RevenueReports";
import PlatformSettings from "./pages/admin/PlatformSettings";
import AdminWallets from "./pages/admin/AdminWallets";
import CoursesLandingPage from "./pages/CoursesLandingpage";
import AboutUs from "./pages/AboutUs";
import ContactUsPage from "./pages/ContactUsPage";

function App() {
  const dispatch = useDispatch();

  // On mount: try to restore session from httpOnly refresh token cookie
  useEffect(() => {
    dispatch(refreshAccessToken())
      .unwrap()
      .then(() => dispatch(fetchCurrentUser()))
      .catch(() => {
        // No valid session — isInitialized will be set to true in rejected handler
      });
  }, [dispatch]);

  return (
    <Routes>
      {/* ── Fully public pages (no auth needed) ──────────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/techmind-courses" element={<CoursesLandingPage />} />
      <Route path="/about" element={<AboutUs/>} />
       <Route path="/contact" element={<ContactUsPage/>} />
      {/* <Route path="/payment/success" element={<PaymentSuccessPage />} /> */}

      {/* ── Auth pages: redirect away if already logged in ────────────────── */}
      <Route element={<PublicRoute />}>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        {/* <Route path="/techmind-courses" element={<CoursesLandingPage />} /> */}
      </Route>

      {/* ── Student routes: only role="student" ──────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/my-courses" element={<MyCoursesPage />} />
          <Route path="/student/learn/:courseId" element={<CoursePlayerPage />} />
          <Route path="/student/learn/:courseId/lesson/:lessonId" element={<CoursePlayerPage />} />
          <Route path="/student/certificate/:courseId" element={<CertificatePage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/courses" element={<CourseCataloguePage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
        </Route>
      </Route>

      {/* ── Creator routes: only role="creator" ──────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={["creator"]} />}>
        <Route element={<CreatorLayout />}>
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/courses" element={<MyCourses />} />
          <Route path="/creator/courses/new" element={<CourseBuilder />} />
          <Route path="/creator/courses/:courseId/edit" element={<CourseBuilder />} />
          <Route path="/creator/courses/:courseId/lessons/:lessonId" element={<LessonEditor />} />
          <Route path="/creator/courses/:courseId/quiz/:lessonId" element={<QuizBuilder />} />
          <Route path="/creator/courses/:courseId/assignment/:lessonId" element={<AssignmentBuilder />} />
          <Route path="/creator/submissions" element={<SubmissionsPage />} />
          <Route path="/creator/analytics" element={<CreatorAnalytics />} />
          <Route path="/creator/wallet" element={<CreatorWallet />} />
          <Route path="/creator/coupons" element={<CouponManager />} />
          <Route path="/creator/certificates" element={<CertificateManager />} />
        </Route>
      </Route>

      {/* ── Admin routes: only role="admin" ──────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
          <Route path="/admin/course-approvals" element={<CourseApprovals />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/revenue" element={<RevenueReports />} />
          <Route path="/admin/settings" element={<PlatformSettings />} />
          <Route path="/admin/wallets" element={<AdminWallets />} />
        </Route>
      </Route>

      {/* ── Catch-all ─────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
