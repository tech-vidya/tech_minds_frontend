import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchCourses } from "../api/services/course.service";
import Navbar from "../components/Navbar";

const ITEMS_PER_PAGE = 6;

/* ───────────────────────── COURSE CARD ───────────────────────── */

function CourseCard({ course }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden  border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition"
    >
      <Link to={`/courses/${course.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
          {course.thumbnail?.url ? (
            <img
              src={course.thumbnail.url}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-4xl">
              📚
            </div>
          )}

          {/* badge */}
          {course.isFree || course.price === 0 ? (
            <span className="absolute top-3 left-3 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              FREE
            </span>
          ) : null}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600">
            {course.title}
          </h3>

          <p className="text-xs text-gray-500 mt-1">{course.creator?.name}</p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span>{course.rating || 4.5}</span>
            </div>

            <div className="font-bold text-indigo-600">
              {course.isFree || course.price === 0
                ? "Free"
                : `₹${(course.discountPrice || course.price).toLocaleString()}`}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ───────────────────────── MAIN PAGE ───────────────────────── */
export default function CoursesLandingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState("All");
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      const data = await fetchCourses({ limit: 50 });
      setCourses(data.courses || []);
      setLoading(false);
    }
    load();
  }, []);

  /* ───────────────── FILTER LOGIC ───────────────── */
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (search) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "All") {
      result = result.filter((c) => c.category === category);
    }

    if (price === "Free") {
      result = result.filter((c) => c.isFree || c.price === 0);
    }

    if (price === "Paid") {
      result = result.filter((c) => !c.isFree && c.price > 0);
    }

    if (rating > 0) {
      result = result.filter((c) => (c.rating || 0) >= rating);
    }

    if (sort === "priceLow") {
      result.sort(
        (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
      );
    }

    if (sort === "priceHigh") {
      result.sort(
        (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
      );
    }

    if (sort === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [courses, search, category, price, rating, sort]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, page]);

  /* ───────────────── UI ───────────────── */
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Navbar />
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 dark:text-white"
        >
          Browse Courses
        </motion.h1>

        <div className="flex items-center justify-between gap-4 mt-5 flex-wrap">
          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search courses..."
            className="w-full md:w-[420px] px-4 py-2 rounded-xl  bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full md:w-[220px] px-4 py-2 rounded-xl  bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6 pb-20">
        {/* FILTERS */}
        <aside className="bg-white dark:bg-gray-900 p-5 rounded-2xl  h-fit sticky top-6">
          {/* CATEGORY */}
          <h3 className="font-semibold mb-3">Category</h3>
          {["All", "Development", "Design", "Business", "Marketing"].map(
            (c) => (
              <p
                key={c}
                onClick={() => {
                  setCategory(c);
                  setPage(1);
                }}
                className={`cursor-pointer text-sm mb-2 ${
                  category === c
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {c}
              </p>
            ),
          )}

          <hr className="my-4" />

          {/* PRICE */}
          <h3 className="font-semibold mb-3">Price</h3>
          {["All", "Free", "Paid"].map((p) => (
            <p
              key={p}
              onClick={() => {
                setPrice(p);
                setPage(1);
              }}
              className={`cursor-pointer text-sm mb-2 ${
                price === p ? "text-indigo-600 font-semibold" : "text-gray-600"
              }`}
            >
              {p}
            </p>
          ))}

          <hr className="my-4" />

          {/* RATING */}
          <h3 className="font-semibold mb-3">Rating</h3>
          {[4, 3, 2].map((r) => (
            <p
              key={r}
              onClick={() => {
                setRating(r);
                setPage(1);
              }}
              className={`cursor-pointer text-sm mb-2 ${
                rating === r ? "text-indigo-600 font-semibold" : "text-gray-600"
              }`}
            >
              ⭐ {r}+
            </p>
          ))}
        </aside>

        {/* COURSES */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
                  />
                ))}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center mt-10 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      page === i + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-gray-900"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
