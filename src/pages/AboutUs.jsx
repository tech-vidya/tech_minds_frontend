import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AboutUs() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
<Navbar/>
      {/* HERO */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-indigo-600 to-violet-600">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white"
        >
          About Tech Minds
        </motion.h1>

        <p className="mt-4 text-indigo-100 max-w-2xl mx-auto text-lg">
          We help students build real-world skills through practical, modern,
          and industry-focused learning experiences.
        </p>
      </section>

      {/* STORY */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Our Mission
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            Tech Minds was created with a simple goal — to make high-quality
            education accessible to everyone. We focus on practical learning,
            real projects, and skills that actually matter in the job market.
          </p>

          <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            Whether you're a beginner or an advanced learner, our platform
            helps you grow step-by-step with structured courses and expert
            mentorship.
          </p>

          <Link
            to="/techmind-courses"
            className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Explore Courses
          </Link>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8">
          <div className="text-6xl text-center">🎓</div>
          <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
            Learn. Build. Grow.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              {
                icon: "🚀",
                title: "Practical Learning",
                desc: "Build real projects instead of just theory.",
              },
              {
                icon: "👨‍🏫",
                title: "Expert Instructors",
                desc: "Learn from industry professionals.",
              },
              {
                icon: "📈",
                title: "Career Growth",
                desc: "Get job-ready skills and guidance.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800"
              >
                <div className="text-4xl">{item.icon}</div>
                <h3 className="mt-3 font-bold text-lg text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Start Your Learning Journey Today
        </h2>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Join thousands of learners improving their skills.
        </p>

        <Link
          to="/register"
          className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold"
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
}