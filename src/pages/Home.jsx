import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  Calendar,
  Heart,
  Tag,
  TrendingUp,
  Filter,
} from "lucide-react";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [typedText, setTypedText] = useState("");
  const [heroVisible, setHeroVisible] = useState(false);

  const fullText = "Amazing Stories";

  // ✅ Replace with
useEffect(() => {
  const visTimer = setTimeout(() => setHeroVisible(true), 100);
  let i = 0;
  const timer = setInterval(() => {
    if (i <= fullText.length) {
      setTypedText(fullText.slice(0, i));
      i++;
    } else {
      clearInterval(timer);
    }
  }, 80);
  return () => {
    clearInterval(timer);
    clearTimeout(visTimer);
  };
}, []);
      
    

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs");
        setBlogs(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = ["All", ...new Set(blogs.map((b) => b.category))];
  const trendingBlogs = [...blogs].sort((a, b) => b.views - a.views).slice(0, 3);
  const filteredBlogs = blogs.filter((blog) => {
    const matchSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || blog.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const BlogCard = ({ blog }) => (
    <Link
      to={`/blog/${blog._id}`}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-300 group"
    >
      {blog.image ? (
        <img
          src={blog.image}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          alt={blog.title}
        />
      ) : (
        <div className="w-full h-44 bg-gray-800 flex items-center justify-center">
          <span className="text-gray-600 text-sm">No Image</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Tag className="w-3 h-3 text-yellow-400" />
          <span className="text-yellow-400 text-xs font-semibold">{blog.category}</span>
        </div>
        <h2 className="text-base font-bold text-white mb-1 group-hover:text-yellow-400 transition line-clamp-2">
          {blog.title}
        </h2>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
          {blog.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-xs">
              {blog.user?.name?.charAt(0).toUpperCase()}
            </div>
            <span>{blog.user?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" />{blog.likes?.length || 0}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero Section with Animations */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black py-8 md:py-16 px-4 text-center border-b border-gray-800 overflow-hidden">

        {/* Floating background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/3 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Content */}
        <div
          className={`relative z-10 transition-all duration-700 ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest animate-bounce">
            Welcome to BlogApp
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 leading-tight">
            Discover{" "}
            <span className="text-yellow-400">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          <p
            className={`text-gray-400 text-sm sm:text-base mb-6 max-w-xl mx-auto transition-all duration-700 delay-300 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Read, write, and share ideas with the world. Your voice matters.
          </p>

          <div
            className={`flex justify-center px-2 transition-all duration-700 delay-500 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title or category..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Trending Blogs */}
        {!loading && trendingBlogs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold">Trending Blogs</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {trendingBlogs.map((blog, index) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog._id}`}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-yellow-400 transition-all duration-300 group relative"
                >
                  <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-gray-900 w-7 h-7 rounded-full flex items-center justify-center font-black text-sm">
                    {index + 1}
                  </div>
                  {blog.image ? (
                    <img
                      src={blog.image}
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={blog.title}
                    />
                  ) : (
                    <div className="w-full h-36 bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">No Image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm group-hover:text-yellow-400 transition line-clamp-2 mb-2">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" />{blog.likes?.length || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-yellow-400" />
            <h2 className="text-lg font-bold">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Latest Blogs */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {selectedCategory === "All" ? "Latest Blogs" : `${selectedCategory} Blogs`}
            <span className="ml-2 text-sm font-normal text-gray-400">({filteredBlogs.length} posts)</span>
          </h2>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-base">No blogs found.</p>
          </div>
        )}

        {!loading && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Home;