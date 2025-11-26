import { useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";

export default function Share() {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [shareLink, setShareLink] = useState(null);

  async function createShare(e) {
    e.preventDefault();
    try {
      const res = await api.post("/files/create-share-link/", { file_id: id, password: password || null });
      const shareId = res.data.share_id;
      const url = `${window.location.origin}/s/${shareId}`;
      setShareLink(url);
    } catch (err) {
      console.error(err);
      alert("Failed to create share link");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Create Share Link</h2>
        <form onSubmit={createShare} className="space-y-3">
          <label className="block">
            Password (optional)
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mt-1 rounded bg-gray-700" />
          </label>
          <button className="bg-green-500 px-4 py-2 rounded">Create Link</button>
        </form>

        {shareLink && (
          <div className="mt-4 bg-gray-900 p-3 rounded">
            <p className="text-sm text-gray-300">Share URL (public):</p>
            <a href={shareLink} className="text-blue-400 break-all">{shareLink}</a>
          </div>
        )}
      </div>
    </div>
  );
}
