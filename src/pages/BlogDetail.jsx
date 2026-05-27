import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSingleBlog, deleteBlog, likeBlog } from "../services/blog";
import { getUser } from "../utils/auth";
import { Heart, Eye, Calendar, Tag, ArrowLeft, Pencil, Trash2 } from "lucide-react";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const currentUser = getUser();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getSingleBlog(id);
        setBlog(data);
        setLikesCount(data.likes?.length || 0);
        if (currentUser) {
          setLiked(data.likes?.includes(currentUser._id));
        }
      } catch {
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id);
      navigate("/");
    } catch {
      alert("Delete failed");
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      const res = await likeBlog(id);
      setLiked(res.liked);
      setLikesCount(res.likes);
    } catch {
      alert("Failed to like blog");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950">
      <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950">
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  );

  const isOwner = currentUser && blog.user._id === currentUser._id;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Category */}
        <div className="flex items-center gap-1 mb-3">
          <Tag className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 text-sm font-semibold">{blog.category}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-xs">
              {blog.user?.name?.charAt(0).toUpperCase()}
            </div>
            <span>{blog.user?.name}</span>
          </div>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {blog.views} views
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Like + Owner Actions Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
              liked
                ? "bg-red-500 border-red-500 text-white"
                : "border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
            <span className="font-medium">{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
          </button>

          {isOwner && (
            <>
              <Link
                to={`/edit-blog/${blog._id}`}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                <Pencil className="w-4 h-4" /> Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </>
          )}
        </div>

        {/* Image */}
        {blog.image && (
          <img
           src={blog.image}
 

            alt={blog.title}
            className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover rounded-xl mb-8"
          />
        )}

        {/* Content */}
        <div className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-line bg-gray-900 rounded-xl p-6 border border-gray-800">
          {blog.description}
        </div>

      </div>
    </div>
  );
}

export default BlogDetail;