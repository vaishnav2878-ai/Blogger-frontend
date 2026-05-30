import { useState,useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { saveAuth , getToken} from "../utils/auth";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate("/");
    }
  },[]);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const res = await API.post("/auth/login", { email, password });
    // Backend returns user data directly, not nested under "user"
    const { token, ...userData } = res.data;
    saveAuth(userData, token);
    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || "Login Failed");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition">
          Login
        </button>

        <p className="text-center text-sm mt-4 text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;