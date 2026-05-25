import API from "./api";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all blogs
export const getAllBlogs = async () => {
  const res = await API.get("/blogs");
  return res.data;
};

// Get single blog
export const getSingleBlog = async (id) => {
  const viewedBlogs = localStorage.getItem("viewedBlog") ||"";
  const res = await API.get(`/blogs/${id}`,{
    headers: {
      "x-viewed-blogs": viewedBlogs,

    },
  

});
//save to localstorage so we dont count again
if (!viewedBlogs.includes(id)) { 
  localStorage.setItem("viewedBlogs", viewedBlogs + id + ",");
}
return res.data;
};


// Create blog
export const createBlog = async (formData) => {
  const res = await API.post("/blogs/create", formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
export const likeBlog = async (id) => {
  const res = await API.put(`/blogs/${id}/like`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

// Update blog
export const updateBlog = async (id, formData) => {
  const res = await API.put(`/blogs/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Delete blog
export const deleteBlog = async (id) => {
  const res = await API.delete(`/blogs/${id}`, authHeader());
  return res.data;
};