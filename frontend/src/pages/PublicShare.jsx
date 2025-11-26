import { useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";

export default function PublicShare() {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAccess(e) {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post(`/files/share/${id}/`, { password: password || null });
      const { file_id } = res.data;
      const dl = await api.get(`/files/download/${file_id}/`);
      const url = dl.data.download_url;
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Failed to access file");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Access Shared File</h2>
        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleAccess} className="space-y-3">
          <label className="block">
            Password (if required)
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mt-1 rounded bg-gray-700" />
          </label>

          <div className="flex items-center space-x-2">
            <button disabled={loading} className="bg-green-500 px-4 py-2 rounded">{loading ? "Opening..." : "Open File"}</button>
            <button type="button" onClick={() => { setPassword(""); }} className="text-sm text-gray-400">Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
}
