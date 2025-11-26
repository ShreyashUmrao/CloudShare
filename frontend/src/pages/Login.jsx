import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div className="bg-gray-900 text-white flex items-center justify-center px-4"
      style={{ minHeight: 'calc(100vh - var(--nav-height))', overflow: 'hidden' }}>
      <div className="card-glass p-8 rounded-lg w-full max-w-md shadow-md" style={{ maxHeight: 'calc(100vh - var(--nav-height) - 40px)', overflow: 'auto' }}>
        <h2 className="text-2xl font-semibold mb-4 text-white">Welcome back</h2>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-3 rounded bg-gray-800 placeholder-gray-400"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-3 rounded bg-gray-800 placeholder-gray-400"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[var(--brand)] py-3 rounded text-white font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow'}`}>
            {loading ? <div className="flex items-center justify-center"><Spinner /></div> : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300">
          Don't have an account? {" "}
          <a href="/register" className="text-indigo-300 hover:underline">Create one</a>
        </p>
      </div>
    </div>
  );
}
