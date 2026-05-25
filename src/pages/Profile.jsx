import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllBlogs, deleteBlog } from "../services/blog";
import { getUser, clearAuth } from "../utils/auth";
import { Eye, Heart, Pencil, Trash2, LogOut, User, BookOpen } from "lucide-react";

function Profile() {
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
      } catch {
        console.log("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await deleteBlog(id);
      setMyBlogs(myBlogs.filter((b) => b._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const totalViews = myBlogs.reduce((acc, b) => acc + (b.views || 0), 0);
  const totalLikes = myBlogs.reduce((acc, b) => acc + (b.likes?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center text-4xl font-black shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <Link
                  to="/create-blog"
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition text-sm"
                >
                  + Create Blog
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:border-red-500 hover:text-red-400 transition text-sm"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className="bg-yellow-400/10 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Blogs</p>
              <p className="text-2xl font-bold text-yellow-400">{myBlogs.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className="bg-blue-400/10 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-blue-400">{totalViews}</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className="bg-red-400/10 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Likes</p>
              <p className="text-2xl font-bold text-red-400">{totalLikes}</p>
            </div>
          </div>
        </div>

        {/* My Blogs */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold">My Blogs</h2>
            <span className="text-gray-400 text-sm">({myBlogs.length})</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : myBlogs.length === 0 ? (
            <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-gray-400 mb-4">No blogs yet!</p>
              <Link
                to="/create-blog"
                className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                + Create Your First Blog
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-yellow-400 transition"
                >
                  <div className="flex items-center gap-4">
                    {blog.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${blog.image}`}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                        alt={blog.title}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-white line-clamp-1">{blog.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full">
                          {blog.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />{blog.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-400" />{blog.likes?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="flex items-center gap-1 text-blue-400 text-xs px-3 py-1.5 rounded-lg border border-blue-800 hover:border-blue-600 transition"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex items-center gap-1 text-red-400 text-xs px-3 py-1.5 rounded-lg border border-red-900 hover:border-red-700 transition"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;