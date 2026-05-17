import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchCourseBySlug, enrollFree } from "../api/services/course.service";
import { validateCoupon } from "../api/services/wallet.service";
import api from "../api/axios";
import { selectIsAuthenticated, selectUserRole } from "../store/slices/authSlice";

const fmtDuration = (s) => { const h = Math.floor(s/3600), m = Math.floor((s%3600)/60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };

function AccordionSection({ section, unlockedIds }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition text-left">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{section.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{section.lessons?.length} lessons</p>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
      </button>
      {open && (
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {section.lessons?.map(lesson => {
            const isUnlocked = lesson.isFreePreview || unlockedIds.has(lesson._id);
            return (
              <div key={lesson._id} className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isUnlocked
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>}
                </svg>
                <span className="flex-1 text-sm text-gray-600 dark:text-gray-300">{lesson.title}</span>
                <div className="flex items-center gap-2">
                  {lesson.quiz && <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">Quiz</span>}
                  {lesson.assignment && <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">Assignment</span>}
                  {lesson.video?.duration > 0 && <span className="text-xs text-gray-400">{fmtDuration(lesson.video.duration)}</span>}
                  {lesson.isFreePreview && <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Free preview</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null); // { discountAmount, finalPrice, message }
  const [couponLoading, setCouponLoading] = useState(false);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  useEffect(() => {
    fetchCourseBySlug(slug)
      .then(d => { setCourse(d.course); setIsEnrolled(d.isEnrolled); })
      .catch(() => toast.error("Course not found"))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
//     if (!isAuthenticated) { navigate("/login"); return; }
//     if (role !== "student") { toast.error("Only students can enroll"); return; }
//     setActionLoading(true);
//     try {
//       if (course.isFree || course.price === 0) {
//         await enrollFree(course._id);
//         toast.success("Enrolled! Let's start learning.");
//         navigate(`/student/learn/${course._id}`);
//       } else {
//         const res = await api.post(`/payments/checkout/${course._id}`, {
//   couponCode: couponResult ? couponCode : null,
// }).then(r => r.data);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Enrollment failed");
//     } finally { setActionLoading(false); }
const res = await api
  .post(`/payments/checkout/${course._id}`, {
    couponCode: couponResult ? couponCode : null,
  })
  .then((r) => r.data);

const options = {
  key: res.keyId,
  amount: res.amount,
  currency: res.currency,
  name: "Tech Minds",
  description: res.courseName,
  order_id: res.orderId,
  method: {
  // upi: true,
  card: true,
  netbanking: true,
  wallet: true,
},

// config: {
//   display: {
//     blocks: {
//       upi: {
//         name: "UPI",
//         instruments: [
//           {
//             method: "upi",
//           },
//         ],
//       },
//     },

    // sequence: ["block.upi"],

//     preferences: {
//       show_default_blocks: true,
//     },
//   },
// },

  handler: async function (response) {
    try {
      const verifyRes = await api.post("/payments/verify", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      toast.success("Payment successful!");

      navigate(`/student/learn/${verifyRes.data.courseId}`);
    } catch (err) {
      toast.error("Payment verification failed");
    }
  },

  prefill: {
    name: res.studentName,
    email: res.studentEmail,
  },

  theme: {
    color: "#4F46E5",
  },
};

const razor = new window.Razorpay(options);

razor.open();
  };


  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const data = await validateCoupon(couponCode, course._id);
      setCouponResult(data.pricing);
      toast.success(data.message);
    } catch (err) {
      setCouponResult(null);
      toast.error(err.response?.data?.message || "Invalid coupon");
    } finally { setCouponLoading(false); }
  };


  if (isLoading) return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center">
        <p className="text-gray-500">Course not found.</p>
        <Link to="/courses" className="text-indigo-600 hover:underline text-sm mt-2 block">Browse courses →</Link>
      </div>
    </div>
  );

  const price = course.discountPrice > 0 ? course.discountPrice : course.price;
  const unlockedIds = new Set();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/courses" className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </Link>
          <Link to="/" className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Tech Minds</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-white/10 px-2.5 py-1 rounded-lg capitalize">{course.level}</span>
              <span className="text-xs text-gray-400">{course.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{course.title}</h1>
            {course.shortDescription && <p className="text-gray-300">{course.shortDescription}</p>}
            <div className="flex items-center gap-4 text-sm text-gray-300 flex-wrap">
              {course.stats?.totalStudents > 0 && <span>👥 {course.stats.totalStudents.toLocaleString()} students</span>}
              {course.stats?.totalLessons > 0 && <span>📹 {course.stats.totalLessons} lessons</span>}
              {course.stats?.totalDuration > 0 && <span>⏱ {fmtDuration(course.stats.totalDuration)}</span>}
              <span>🌐 {course.language}</span>
            </div>
            <div className="flex items-center gap-3">
              {course.creator?.avatar?.url ? (
                <img src={course.creator.avatar.url} alt={course.creator.name} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-bold">{course.creator?.name?.charAt(0)}</div>
              )}
              <span className="text-sm text-gray-300">by <span className="text-white font-medium">{course.creator?.name}</span></span>
            </div>
          </div>

          {/* Sticky CTA card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 text-gray-900 dark:text-white">
            {/* Demo video or thumbnail */}
            <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700 relative group">
              {showDemoVideo && course.previewVideo?.url ? (
                <video src={course.previewVideo.url} controls autoPlay
                  className="w-full h-full" onEnded={() => setShowDemoVideo(false)} />
              ) : (
                <>
                  {course.thumbnail?.url && (
                    <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover" />
                  )}
                  {course.previewVideo?.url && (
                    <button onClick={() => setShowDemoVideo(true)}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/50 transition gap-2 group">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <svg className="w-7 h-7 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full">Watch Preview</span>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Price */}
            <div className="mb-3">
              {course.isFree || price === 0 ? (
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">Free</span>
              ) : (
                <div className="flex items-baseline gap-2">
                  {couponResult ? (
                    <>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₹{couponResult.finalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 line-through">₹{price.toLocaleString()}</span>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-semibold">
                        Save ₹{couponResult.discountAmount.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-bold">₹{price.toLocaleString()}</span>
                      {course.discountPrice > 0 && course.price > course.discountPrice && (
                        <span className="text-sm text-gray-400 line-through">₹{course.price.toLocaleString()}</span>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {isEnrolled ? (
              <Link to={`/student/learn/${course._id}`}
                className="w-full block text-center py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition">
                Continue learning →
              </Link>
            ) : (
              <>
                <button onClick={handleEnroll} disabled={actionLoading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 mb-3">
                  {actionLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
                  {course.isFree || price === 0
                    ? "Enroll for free"
                    : couponResult
                      ? `Enroll for ₹${couponResult.finalPrice.toLocaleString()}`
                      : `Enroll for ₹${price.toLocaleString()}`}
                </button>

                {/* Coupon input — only for paid courses */}
                {!(course.isFree || price === 0) && !isEnrolled && isAuthenticated && role === "student" && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponResult(null); }}
                        placeholder="Coupon code"
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-400 uppercase"
                      />
                      <button onClick={handleValidateCoupon} disabled={couponLoading || !couponCode.trim()}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl transition">
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponResult && (
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        ✓ Coupon applied — you save ₹{couponResult.discountAmount.toLocaleString()}!
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
            <p className="text-xs text-gray-400 text-center mt-3">
              {course.isFree || price === 0 ? "No payment required" : "Secure checkout via Stripe"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            {course.whatYouLearn?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.whatYouLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About this course</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">{course.description}</p>
            </div>

            {/* Curriculum */}
            {course.sections?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Curriculum <span className="text-sm font-normal text-gray-400">({course.sections.length} sections · {course.stats?.totalLessons || 0} lessons)</span>
                </h2>
                <div className="space-y-2">
                  {course.sections.map(section => (
                    <AccordionSection key={section._id} section={section} unlockedIds={unlockedIds} />
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Requirements</h2>
                <ul className="space-y-1.5">
                  {course.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-gray-400 mt-0.5">•</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: instructor */}
          <div className="space-y-5">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Your instructor</h3>
              <div className="flex items-center gap-3 mb-3">
                {course.creator?.avatar?.url ? (
                  <img src={course.creator.avatar.url} alt={course.creator.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-lg font-bold text-indigo-600 dark:text-indigo-300">{course.creator?.name?.charAt(0)}</div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{course.creator?.name}</p>
                  <p className="text-xs text-gray-500">Course Creator</p>
                </div>
              </div>
              {course.creator?.bio && <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{course.creator.bio}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
