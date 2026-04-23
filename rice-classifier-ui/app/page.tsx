"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const fileInputId = "rice-image-upload";

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-100 text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Rice Classifier 🌾
        </h1>

        {/* Custom file picker: a square drop zone with a centered plus sign. */}
        <div className="mb-4 flex flex-col items-center gap-3">
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="sr-only"
          />

          <label
            htmlFor={fileInputId}
            className="flex h-40 w-40 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-green-50 text-6xl font-light text-green-600 transition hover:border-green-500 hover:bg-green-100"
            aria-label="Upload an image file"
          >
            +
          </label>

          {/* Show the chosen file name so the upload state is visible. */}
          <p className="max-w-full truncate text-sm text-gray-600">
            {file ? file.name : "Choose a rice image"}
          </p>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file}
          className="bg-green-600 text-white px-4 py-2 rounded-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
        >
          Predict
        </button>

        {result && (
          <div className="mt-6">
            {/* Render the model prediction returned by the backend. */}
            <p className="text-lg font-semibold text-green-800">
              {result.class}
            </p>
            <p className="text-gray-600">
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
