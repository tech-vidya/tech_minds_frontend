// MyCertificatesPage.jsx
// Place at: src/pages/student/MyCertificatesPage.jsx
//
// Dependencies needed:
//   npm install html2canvas jspdf
//
// Backend route needed:
//   GET /enrollments/my-certificates
//   → returns { enrollments: [{ _id, course: { _id, title, creator, stats }, certificateIssuedAt }] }
//
// Add to your router:
//   <Route path="/student/my-certificates" element={<MyCertificatesPage />} />

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";

/* ─── helpers ─────────────────────────────────────────── */
const fmtDuration = (s) => {
  const h = Math.floor(s / 3600);
  return h > 0 ? `${h}h` : `${Math.floor(s / 60)}m`;
};

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

/* ─── Certificate template (rendered for view + PDF) ──── */
function CertificateTemplate({ enrollment, user, forPdf = false }) {
  const course = enrollment.course;
  const issuedDate = fmtDate(enrollment.certificateIssuedAt);
  const certId = enrollment._id?.slice(-12).toUpperCase();

  return (
    <div
      style={{
        width: forPdf ? "1122px" : "100%",
        aspectRatio: "1.414 / 1",
        background: "#ffffff",
        fontFamily: "'Georgia', serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div style={{ height: 10, background: "linear-gradient(90deg,#4f46e5,#7c3aed,#4f46e5)" }} />

      {/* Watermark pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, #e0e7ff 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      {/* Corner brackets */}
      {[
        { top: 18, left: 18, borderTop: "3px solid #c7d2fe", borderLeft: "3px solid #c7d2fe", borderRadius: "10px 0 0 0" },
        { top: 18, right: 18, borderTop: "3px solid #c7d2fe", borderRight: "3px solid #c7d2fe", borderRadius: "0 10px 0 0" },
        { bottom: 18, left: 18, borderBottom: "3px solid #c7d2fe", borderLeft: "3px solid #c7d2fe", borderRadius: "0 0 0 10px" },
        { bottom: 18, right: 18, borderBottom: "3px solid #c7d2fe", borderRight: "3px solid #c7d2fe", borderRadius: "0 0 10px 0" },
      ].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: 52, height: 52, ...s }} />
      ))}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              fontSize: forPdf ? 28 : "clamp(18px,2.5vw,26px)",
              fontWeight: 700,
              fontFamily: "'Georgia', serif",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 1,
            }}
          >
            Tech Minds
          </span>
        </div>

        {/* Title label */}
        <div style={{ marginBottom: 14 }}>
          <p
            style={{
              fontSize: forPdf ? 11 : "clamp(8px,1vw,11px)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#9ca3af",
              fontFamily: "sans-serif",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Certificate of Completion
          </p>
          <div
            style={{
              height: 2,
              width: 80,
              background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
              margin: "8px auto 0",
              borderRadius: 2,
            }}
          />
        </div>

        <p
          style={{
            fontSize: forPdf ? 13 : "clamp(10px,1.2vw,13px)",
            color: "#6b7280",
            fontFamily: "sans-serif",
            margin: "0 0 8px",
          }}
        >
          This is to certify that
        </p>

        {/* Student name */}
        <h2
          style={{
            fontSize: forPdf ? 44 : "clamp(24px,4vw,44px)",
            fontWeight: 700,
            color: "#111827",
            fontFamily: "'Georgia', serif",
            margin: "0 0 8px",
            lineHeight: 1.1,
          }}
        >
          {user?.name || "Student"}
        </h2>

        <p
          style={{
            fontSize: forPdf ? 13 : "clamp(10px,1.2vw,13px)",
            color: "#6b7280",
            fontFamily: "sans-serif",
            margin: "0 0 8px",
          }}
        >
          has successfully completed the course
        </p>

        {/* Course title */}
        <h3
          style={{
            fontSize: forPdf ? 20 : "clamp(13px,1.8vw,20px)",
            fontWeight: 700,
            color: "#4f46e5",
            fontFamily: "'Georgia', serif",
            margin: "0 0 20px",
            maxWidth: 600,
            lineHeight: 1.3,
          }}
        >
          {course?.title}
        </h3>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 32, marginBottom: 28 }}>
          {course?.stats?.totalLessons > 0 && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: forPdf ? 22 : "clamp(14px,2vw,22px)", fontWeight: 700, color: "#111827", margin: 0 }}>
                {course.stats.totalLessons}
              </p>
              <p style={{ fontSize: forPdf ? 10 : "clamp(8px,0.9vw,10px)", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "sans-serif", margin: 0 }}>
                Lessons
              </p>
            </div>
          )}
          {course?.stats?.totalDuration > 0 && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: forPdf ? 22 : "clamp(14px,2vw,22px)", fontWeight: 700, color: "#111827", margin: 0 }}>
                {Math.round(course.stats.totalDuration / 3600)}h
              </p>
              <p style={{ fontSize: forPdf ? 10 : "clamp(8px,0.9vw,10px)", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "sans-serif", margin: 0 }}>
                Hours
              </p>
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: forPdf ? 22 : "clamp(14px,2vw,22px)", fontWeight: 700, color: "#111827", margin: 0 }}>
              {issuedDate}
            </p>
            <p style={{ fontSize: forPdf ? 10 : "clamp(8px,0.9vw,10px)", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "sans-serif", margin: 0 }}>
              Completed on
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", maxWidth: 480 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ height: 1, width: 120, background: "#d1d5db", marginBottom: 6, margin: "0 auto 6px" }} />
            <p style={{ fontSize: forPdf ? 11 : "clamp(9px,1vw,11px)", color: "#6b7280", fontFamily: "sans-serif", margin: 0 }}>
              {course?.creator?.name || "Instructor"}
            </p>
            <p style={{ fontSize: forPdf ? 10 : "clamp(8px,0.9vw,10px)", color: "#9ca3af", fontFamily: "sans-serif", margin: 0 }}>
              Course Instructor
            </p>
          </div>

          {/* Seal */}
          <div
            style={{
              width: forPdf ? 56 : "clamp(36px,5vw,56px)",
              height: forPdf ? 56 : "clamp(36px,5vw,56px)",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{ width: forPdf ? 28 : "clamp(18px,2.5vw,28px)", height: forPdf ? 28 : "clamp(18px,2.5vw,28px)" }}
              fill="none"
              stroke="white"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ height: 1, width: 120, background: "#d1d5db", marginBottom: 6, margin: "0 auto 6px" }} />
            <p style={{ fontSize: forPdf ? 11 : "clamp(9px,1vw,11px)", color: "#6b7280", fontFamily: "sans-serif", margin: 0 }}>
              Tech Minds
            </p>
            <p style={{ fontSize: forPdf ? 10 : "clamp(8px,0.9vw,10px)", color: "#9ca3af", fontFamily: "sans-serif", margin: 0 }}>
              Platform
            </p>
          </div>
        </div>

        {/* Cert ID */}
        <p
          style={{
            fontSize: forPdf ? 10 : "clamp(8px,0.8vw,10px)",
            color: "#d1d5db",
            fontFamily: "sans-serif",
            marginTop: 16,
          }}
        >
          Certificate ID: {certId}
        </p>
      </div>

      {/* Bottom bar */}
      <div style={{ height: 6, background: "linear-gradient(90deg,#4f46e5,#7c3aed,#4f46e5)" }} />
    </div>
  );
}

/* ─── Certificate viewer modal ───────────────────────── */
function CertificateModal({ enrollment, user, onClose }) {
  const certRef = useRef(null);
  const pdfRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setDownloading(true);
    try {
      // Briefly make the hidden PDF-size element visible for capture
      pdfRef.current.style.position = "fixed";
      pdfRef.current.style.top = "-9999px";
      pdfRef.current.style.left = "0";
      pdfRef.current.style.display = "block";

      await new Promise((r) => setTimeout(r, 100)); // let fonts settle

      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      pdfRef.current.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${enrollment.course?.title?.replace(/\s+/g, "_") || "certificate"}.pdf`);
      toast.success("Certificate downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Download failed. Try the Print option instead.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    // Build a clean print window
    const printWin = window.open("", "_blank", "width=1200,height=900");
    if (!printWin) { toast.error("Allow pop-ups to print"); return; }
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Certificate – ${enrollment.course?.title}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#fff; }
    @page { size: A4 landscape; margin:0; }
    @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
  </style>
</head>
<body>${certRef.current?.outerHTML || ""}</body>
</html>`;
    printWin.document.write(html);
    printWin.document.close();
    printWin.onload = () => { printWin.focus(); printWin.print(); };
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdrop}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 25 }}
          className="w-full max-w-4xl"
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-white/80 text-sm font-medium truncate max-w-xs">
              {enrollment.course?.title}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center gap-1.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-3.5 py-2 rounded-xl transition"
              >
                {downloading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                )}
                {downloading ? "Generating…" : "Download PDF"}
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Visible responsive certificate */}
          <div
            ref={certRef}
            className="rounded-2xl overflow-hidden shadow-2xl w-full"
          >
            <CertificateTemplate enrollment={enrollment} user={user} />
          </div>
        </motion.div>

        {/* Hidden 1122px-wide clone for PDF export */}
        <div ref={pdfRef} style={{ display: "none", width: 1122 }}>
          <CertificateTemplate enrollment={enrollment} user={user} forPdf />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Main page ─────────────────────────────────────── */
export default function CertificatesPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(null); // enrollment to view

  useEffect(() => {
    api
      .get("/enrollments/my-certificates")
      .then((r) => setEnrollments(r.data.enrollments || []))
      .catch(() => toast.error("Failed to load certificates"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (enrollments.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="text-7xl mb-5">🎓</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No certificates yet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm">
          Complete a course and get approved by the instructor to earn your certificate.
        </p>
        <Link
          to="/courses"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
        >
          Browse courses →
        </Link>
      </div>
    );

  return (
    <>
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {enrollments.length} certificate{enrollments.length !== 1 ? "s" : ""} earned
          </p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-3">
          {enrollments.map((enrollment, i) => {
            const course = enrollment.course;
            const issuedDate = fmtDate(enrollment.certificateIssuedAt);

            return (
              <motion.div
                key={enrollment._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex gap-4 items-start"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
                    {course?.title}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {course?.creator?.name && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        by {course.creator.name}
                      </span>
                    )}
                    {course?.stats?.totalDuration > 0 && (
                      <span className="text-xs text-gray-400">
                        ⏱ {fmtDuration(course.stats.totalDuration)}
                      </span>
                    )}
                    {course?.stats?.totalLessons > 0 && (
                      <span className="text-xs text-gray-400">
                        📹 {course.stats.totalLessons} lessons
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                    Issued on {issuedDate}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <button
                      onClick={() => setSelected(enrollment)}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg transition"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      View certificate
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <CertificateModal
          enrollment={selected}
          user={user}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}