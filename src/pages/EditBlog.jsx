import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleBlog, updateBlog } from "../services/blog";


function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getSingleBlog(id);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setCurrentImage(data.image);
      } catch {
        setError("Failed to load blog");
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      if (image) formData.append("image", image);

      await updateBlog(id, formData);
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950">
      <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">

        <div className="mb-8 text-center">
          <span className="inline-block bg-yellow-400/10 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
            Edit Post
          </span>
          <h1 className="text-3xl font-bold">
            Update <span className="text-yellow-400">Blog</span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col gap-5"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <input
              type="text"
              value={category}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              rows={8}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Current Image */}
          {currentImage && !image && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Image</label>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${currentImage}`}


                className="w-full h-40 object-cover rounded-xl"
                alt="current"
              />
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Change Image (optional)
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-yellow-400 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageUpload"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label htmlFor="imageUpload" className="cursor-pointer">
                {image ? (
                  <div className="text-green-400">
                    <p className="text-2xl mb-1">✅</p>
                    <p className="text-sm font-medium">{image.name}</p>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <p className="text-3xl mb-2">📸</p>
                    <p className="text-sm">Click to change image</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </span>
            ) : (
              "✅ Update Blog"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBlog;