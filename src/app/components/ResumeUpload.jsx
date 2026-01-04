"use client";

import { useState } from "react";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage("✅ Resume uploaded successfully");
      console.log("Resume ID:", data.resume._id);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Upload Resume
      </h2>

      <p className="text-gray-500 text-sm mb-6">
        Upload your resume (PDF) for ATS analysis
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-700 mb-4
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:bg-gray-100 file:text-gray-700
        hover:file:bg-gray-200"
      />

      {file && (
        <p className="text-sm text-gray-600 mb-3">
          📄 {file.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-2 rounded-md text-white font-medium transition
          ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"}`}
      >
        {loading ? "Uploading..." : "Upload Resume"}
      </button>

      {message && (
        <p className="text-green-600 text-sm mt-4">{message}</p>
      )}

      {error && (
        <p className="text-red-600 text-sm mt-4">{error}</p>
      )}
    </div>
  );
}
