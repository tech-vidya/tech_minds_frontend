import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      return toast.error("All fields are required");
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("Message sent 🚀");

      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-indigo-600 blur-[140px] opacity-30 rounded-full" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-violet-600 blur-[140px] opacity-30 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20">
          {/* HEADER */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <h1 className="text-5xl font-black">Let’s Talk 👋</h1>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              Have questions, ideas, or feedback? We’d love to hear from you.
            </p>
          </motion.div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-10">
            {/* FORM CARD */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
                />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
                />

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message..."
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none resize-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold hover:scale-[1.02] transition"
                >
                  {loading ? "Sending..." : "Send Message 🚀"}
                </button>
              </div>
            </motion.form>

            {/* INFO CARDS */}
            <div className="space-y-6">
              {[
                {
                  icon: "📍",
                  title: "Office",
                  desc: "Tech Minds HQ, India",
                },
                {
                  icon: "📧",
                  title: "Email",
                  desc: "support@techvidya.com",
                },
                {
                  icon: "⚡",
                  title: "Response Time",
                  desc: "Within 24 hours",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
                >
                  <div className="text-3xl">{item.icon}</div>
                  <h3 className="font-semibold mt-3 text-lg">{item.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
