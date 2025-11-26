import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="bg-[#0f1724] text-white shadow-md" style={{"--nav-height": "64px"}}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#0b1226] flex items-center justify-center border border-white/5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" fill="var(--brand)" opacity="0.95" />
              </svg>
            </div>
            <span className="font-medium text-lg text-white">CloudShare</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <span className="text-sm text-gray-300">{user.username}</span>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-x-2">
              <Link to="/login" className="text-sm text-gray-300 hover:text-white transition">Login</Link>
              <Link to="/register" className="text-sm text-[#60a5a6] hover:opacity-90 transition">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
