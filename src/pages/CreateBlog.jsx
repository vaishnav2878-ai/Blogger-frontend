import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !category) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      if (image) formData.append("image", image);

      await API.post("/blogs/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-block bg-yellow-400/10 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
            New Post
          </span>
          <h1 className="text-3xl font-bold">
            Create a <span className="text-yellow-400">Blog</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Share your ideas with the world</p>
        </div>

        {/* Form */}
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter blog title..."
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          
<div>
  <label className="block text-sm font-medium text-gray-300 mb-2">
    Category
  </label>
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
  >
    <option value="" disabled>Select a category...</option>
    <option value="Sports">Sports</option>
    <option value="Music">Music</option>
    <option value="Movie">Movie</option>
    <option value="Trading">Trading</option>
    <option value="Comics">Comics</option>
    <option value="Health">Health</option>
    <option value="Entertainment">Entertainment</option>
    <option value="Fitness">Fitness</option>
    <option value="Others">Others</option>
  </select>

  {/* Show text input if Others selected */}
  {category === "Others" && (
    <input
      type="text"
      placeholder="Enter your category..."
      className="w-full mt-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
      onChange={(e) => setCategory(e.target.value)}
    />
  )}
</div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Write your blog content here..."
              rows={8}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition resize-none"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail Image
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
                    <p className="text-sm">Click to upload image</p>
                    <p className="text-xs mt-1">PNG, JPG, WEBP supported</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Publishing...
              </span>
            ) : (
              "🚀 Publish Blog"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;