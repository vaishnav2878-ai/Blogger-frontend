import axios from "axios";

const API = "http://localhost:5000/api/auth";

// REGISTER
export const registerUser = async (userData) => {
  const res = await axios.post(`${API}/register`, userData);
  return res.data;
};

// LOGIN
export const loginUser = async (userData) => {
  const res = await axios.post(`${API}/login`, userData);
  return res.data;
};