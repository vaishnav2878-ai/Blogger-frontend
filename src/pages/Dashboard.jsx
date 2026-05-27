import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllBlogs, deleteBlog } from "../services/blog";
import { getUser } from "../utils/auth";

function Dashboard() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchMyBlogs = async () => {
      try {
        const all = await getAllBlogs();
        const mine = all.filter((blog) => blog.user._id === user._id);
        setMyBlogs(mine);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBlogs();
  }, [navigate, user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await deleteBlog(id);
      setMyBlogs(myBlogs.filter((b) => b._id !== id));
    } catch  {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">

      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              My <span className="text-yellow-400">Dashboard</span>
            </h1>
            <p className="text-gray-400 mt-1">Manage your blogs</p>
          </div>
          <Link
            to="/create-blog"
            className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            + Create Blog
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Total Blogs</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">{myBlogs.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Total Views</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">
              {myBlogs.reduce((acc, b) => acc + (b.views || 0), 0)}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Welcome</p>
            <p className="text-xl font-bold text-yellow-400 mt-1">👤 {user?.name}</p>
          </div>
        </div>

        {/* Blog List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : myBlogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-gray-400 text-lg">No blogs yet. Create your first one!</p>
            <Link
              to="/create-blog"
              className="inline-block mt-4 bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              + Create Blog
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {myBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between hover:border-yellow-400 transition"
              >
                <div className="flex items-center gap-4">
                  {blog.image ? (
                    <img
                     src={blog.image}
 
                      className="w-16 h-16 rounded-lg object-cover"
                      alt={blog.title}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-2xl">
                      📝
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{blog.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full">
                        {blog.category}
                      </span>
                      <span>👁 {blog.views} views</span>
                      <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit-blog/${blog._id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1.5 rounded-lg border border-blue-800 hover:border-blue-600 transition"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg border border-red-900 hover:border-red-700 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;