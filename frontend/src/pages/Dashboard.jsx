import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api";
import UploadBox from "../components/UploadBox";
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadFiles() {
    try {
      setLoading(true);
      const res = await api.get("/files/my-files/");
      setFiles(res.data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this file? This action cannot be undone.")) return;
    try {
      await api.delete(`/files/delete/${id}/`);
      loadFiles();
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Delete failed");
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6 flex flex-col" style={{ minHeight: 'calc(100vh - var(--nav-height))' }}>
        <div className="mb-4 flex-none">
          <h1 className="text-3xl font-bold">My Files</h1>
        </div>

        <div className="flex-none">
          <UploadBox onUploadComplete={loadFiles} />
        </div>

        <div className="flex-1 overflow-auto mt-4">
          {loading ? (
            <div className="py-8 flex justify-center"><Spinner /></div>
          ) : (
            files.length === 0 ? (
              <div className="bg-gray-800 p-6 rounded text-gray-400">No files uploaded yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map((file) => {
                  const sizeMB = (file.file_size / (1024 * 1024)).toFixed(2);
                  return (
                    <div key={file.id} className="bg-gray-800 p-4 rounded flex items-center justify-between hover-scale card-glass">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center border border-white/5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3h-4l-2 4h8l-2-4z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">{file.file_name}</div>
                          <div className="text-sm text-gray-400">{sizeMB} MB • {new Date(file.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a href={`/share/${file.id}`} className="px-3 py-1 bg-[#1f2937] text-gray-200 rounded text-sm hover:bg-[#111827] transition">Share</a>
                        <a href={`/analytics/${file.id}`} className="px-3 py-1 bg-[var(--brand)] text-white rounded text-sm hover:opacity-95 transition">Analytics</a>
                        <button onClick={() => handleDelete(file.id)} className="px-3 py-1 bg-red-500 rounded text-sm hover:bg-red-600 transition">Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
