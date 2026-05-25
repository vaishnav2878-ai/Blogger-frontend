import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../utils/auth";

function Navbar() {
  const [user, setUser] = useState(getUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => setUser(getUser());
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gray-950 text-white shadow-lg border-b border-gray-800">
      <div className="flex items-center justify-between px-6 h-[70px]">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-yellow-400 text-gray-900 w-9 h-9 rounded-lg flex items-center justify-center text-lg font-black shadow-md">
            B
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            Blog<span className="text-yellow-400">App</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-5 items-center text-sm font-medium">
          <Link to="/" className="text-gray-300 hover:text-yellow-400 transition">
            Home
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="text-gray-300 hover:text-yellow-400 transition">
                Login
              </Link>
              <Link to="/register" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition shadow">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-yellow-400 transition">
                Dashboard
              </Link>
              <Link to="/create-blog" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition shadow">
                + Create Blog
              </Link>
              <Link
  to="/profile"
  className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-yellow-400 transition"
>
  <div className="w-7 h-7 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-sm">
    {user.name?.charAt(0).toUpperCase()}
  </div>
  <span className="text-gray-200 text-sm">{user.name}</span>
</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition shadow"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger Button (mobile only) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-300 hover:text-yellow-400 transition"
          >
            Home
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-yellow-400 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold text-center hover:bg-yellow-300 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
  to="/profile"
  className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-yellow-400 transition"
>
  <div className="w-7 h-7 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-sm">
    {user.name?.charAt(0).toUpperCase()}
  </div>
  <span className="text-gray-200 text-sm">{user.name}</span>
</Link>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-yellow-400 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/create-blog"
                onClick={() => setMenuOpen(false)}
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold text-center hover:bg-yellow-300 transition"
              >
                + Create Blog
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;