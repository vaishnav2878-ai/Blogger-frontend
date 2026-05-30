import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { saveAuth , getToken} from "../utils/auth";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() =>{
    if (getToken()) {
      navigate("/");
    }
  }, []);

  const handleRegister = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const res = await API.post("/auth/register", { name, email, password });
    const { token, ...userData } = res.data;
    saveAuth(userData, token);
    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || "Register Failed");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded transition">
          Register
        </button>

        <p className="text-center text-sm mt-4 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;