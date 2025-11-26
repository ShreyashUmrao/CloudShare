import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    const res = await register(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error);
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="bg-gray-900 text-white flex items-center justify-center px-4"
      style={{ minHeight: 'calc(100vh - var(--nav-height))', overflow: 'hidden' }}>
      <div className="card-glass p-8 rounded-lg w-full max-w-md shadow-md" style={{ maxHeight: 'calc(100vh - var(--nav-height) - 40px)', overflow: 'auto' }}>
        <h2 className="text-2xl font-bold mb-4 text-white">Create an account</h2>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <form onSubmit={handleRegister}>
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
            className={`w-full bg-[var(--accent)] py-3 rounded text-white font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow'}`}>
            {loading ? <Spinner /> : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300">
          Already have an account? {" "}
          <a href="/login" className="text-indigo-300 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
