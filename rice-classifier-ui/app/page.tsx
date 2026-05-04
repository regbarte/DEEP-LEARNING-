"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputId = "rice-image-upload";

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/predict`;
      console.log("Uploading to:", apiUrl);
      const res = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      const errorMsg =
        err?.message || "Failed to connect to backend. Is the server running?";
      console.error("Upload failed:", errorMsg);
      setError(errorMsg);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Logic for Strategy #2: Detection of "Ambiguous" results
  const isLowConfidence = result && result.confidence < 0.65;

  // Find the runner-up to show if it's a "toss-up"
  const runnerUp = result?.distribution
    ? [...result.distribution].sort((a, b) => b.score - a.score)[1]
    : null;

  const isTossUp =
    result && runnerUp && result.confidence - runnerUp.score < 0.15;

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isLowConfidence ? "bg-amber-50" : "bg-green-50"}`}
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 w-100 text-center border border-gray-100">
        <h1
          className={`text-2xl font-bold mb-4 ${isLowConfidence ? "text-amber-700" : "text-green-700"}`}
        >
          Rice Classifier 🌾
        </h1>

        <div className="mb-4 flex flex-col items-center gap-3">
          <input
            id={fileInputId}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              setError(null);

              if (selectedFile) {
                // Validate file type
                const validTypes = ["image/jpeg", "image/png", "image/jpg"];
                if (!validTypes.includes(selectedFile.type)) {
                  setError("Please upload a JPG or PNG image file");
                  setFile(null);
                  setPreview(null);
                  return;
                }

                setFile(selectedFile);
                setResult(null);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreview(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
              } else {
                setPreview(null);
                setFile(null);
              }
            }}
            className="sr-only"
          />

          {error && (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <label
            htmlFor={fileInputId}
            className={`flex h-40 w-40 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed transition overflow-hidden ${
              isLowConfidence
                ? "border-amber-300 bg-amber-50 text-amber-600 hover:border-amber-500"
                : "border-green-300 bg-green-50 text-green-600 hover:border-green-500"
            }`}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-6xl font-light">+</span>
            )}
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`w-full text-white px-4 py-2 rounded-lg font-bold transition disabled:cursor-not-allowed ${
            isLowConfidence
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-green-600 hover:bg-green-700"
          } disabled:bg-gray-300`}
        >
          {loading ? "Analyzing..." : "Classify Grain"}
        </button>

        {result && (
          <div className="mt-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Strategy 2: Dynamic Result Card */}
            <div
              className={`p-4 rounded-xl border mb-6 text-center transition-all ${
                isLowConfidence
                  ? "bg-amber-100 border-amber-200"
                  : "bg-green-100 border-green-200 shadow-sm"
              }`}
            >
              <p
                className={`text-xs uppercase font-bold tracking-widest mb-1 ${isLowConfidence ? "text-amber-600" : "text-green-600"}`}
              >
                {isTossUp ? "Ambiguous Match" : "Top Match"}
              </p>
              <p
                className={`text-3xl font-black ${isLowConfidence ? "text-amber-900" : "text-green-900"}`}
              >
                {result.prediction}
              </p>
              <p
                className={`font-medium ${isLowConfidence ? "text-amber-700" : "text-green-700"}`}
              >
                {(result.confidence * 100).toFixed(1)}% Confidence
              </p>

              {/* Strategy 2: The "Toss-Up" UI */}
              {isTossUp && (
                <div className="mt-2 pt-2 border-t border-amber-200 text-xs italic text-amber-800">
                  Could also be: <strong>{runnerUp.label}</strong> (
                  {(runnerUp.score * 100).toFixed(1)}%)
                </div>
              )}
            </div>

            <h3 className="text-[10px] font-black text-gray-400 uppercase mb-3 px-1 tracking-widest">
              Confidence Distribution
            </h3>
            <div className="space-y-3">
              {result.distribution.map((item: any) => (
                <div key={item.label} className="w-full">
                  <div className="flex justify-between mb-1 px-1 text-xs">
                    <span className="font-bold text-gray-700">
                      {item.label}
                    </span>
                    <span className="text-gray-500">
                      {(item.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-1000 ${
                        item.label === result.prediction
                          ? isLowConfidence
                            ? "bg-amber-500"
                            : "bg-green-500"
                          : "bg-gray-300"
                      }`}
                      style={{ width: `${item.score * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning Message */}
            {isLowConfidence && (
              <div className="mt-6 p-3 bg-white border border-amber-200 rounded-lg shadow-inner">
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  <strong>Note:</strong> The features of this grain are common
                  across multiple varieties (like Ipsala). The classifier is
                  providing the most statistically likely match.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
