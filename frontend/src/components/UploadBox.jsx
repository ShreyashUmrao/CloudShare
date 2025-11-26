import { useState, useRef } from "react";
import { api } from "../api/api";

export default function UploadBox({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  async function doUpload(file) {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      await api.post("/files/test-upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded / p.total) * 100);
          setProgress(percent);
        }
      });

      setUploading(false);
      setProgress(0);
      onUploadComplete();
    } catch (err) {
      setUploading(false);
    }
  }

  function handleFiles(e) {
    const file = e.target.files?.[0];
    doUpload(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    doUpload(file);
  }

  return (
    <div className="card-glass p-6 rounded mb-6 shadow-md">
      <h2 className="text-xl mb-4 font-semibold">Upload File</h2>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`w-full border-2 ${dragOver ? 'border-[var(--accent)] bg-gray-800/65' : 'border-gray-700'} rounded p-6 flex flex-col items-center justify-center text-center cursor-pointer hover-scale`}
        onClick={() => inputRef.current.click()}
      >
        <input ref={inputRef} type="file" onChange={handleFiles} className="hidden" />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5-5m0 0l5 5m-5-5v12" />
        </svg>
        <div className="text-sm text-gray-300">Drag & drop a file here or click to select</div>
        {uploading && (
          <div className="w-full bg-gray-700 rounded h-3 mt-4">
            <div className="bg-[var(--accent)] h-3 rounded transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
