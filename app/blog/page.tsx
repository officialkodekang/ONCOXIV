"use client";

import React, { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [heatmapImage, setHeatmapImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState("resnet"); // Default model is now ResNet

  // Label maps with numeric keys
  const binaryLabelMap: { [key: number]: string } = {
    0: "Benign",
    1: "Malignant",
  };

  const subtypeLabelMap: { [key: number]: string } = {
    0: "Pre-B",
    1: "Pro-B",
    2: "early Pre-B",
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      // Generate a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setImagePreview(e.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", selectedModel);

    setLoading(true);
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();

      if (!response.ok) {
        // Display the error message from the response
        const errorData = JSON.parse(responseText);
        throw new Error(
          `Server Error: ${response.status} - ${errorData.error}`
        );
      }

      // Define the expected structure of the API response
      interface ApiResponse {
        binary_class_id: number;
        subtype_class_id: number;
        heatmap: string; // Base64-encoded image data
      }

      const data: ApiResponse = JSON.parse(responseText);

      console.log(data);

      // Map the labels to human-readable labels
      const binaryLabel = binaryLabelMap[data.binary_class_id] || "Unknown";
      const subtypeLabel = subtypeLabelMap[data.subtype_class_id] || "Unknown";

      const resultText = `Binary Classification: ${binaryLabel}\nSubtype Classification: ${subtypeLabel}`;

      setResult(resultText);

      // Set the heatmap image
      if (data.heatmap) {
        const heatmapSrc = data.heatmap.startsWith("data:image")
          ? data.heatmap
          : `data:image/png;base64,${data.heatmap}`;
        setHeatmapImage(heatmapSrc);
      } else {
        setHeatmapImage(null);
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(`Failed to upload image: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 sm:min-h-[91vh] min-h-[88vh] pt-6 px-4">
      {/* Header Section */}
      <div className="mb-7 flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold">Upload an Image</h1>
        <p className="text-gray-600">
          Upload your image and process it here.
        </p>
      </div>

      {/* Model Selection */}
      <div>
        <label htmlFor="modelSelect" className="block mb-2 font-medium">
          Select Model:
        </label>
        <select
          id="modelSelect"
          value={selectedModel}
          onChange={handleModelChange}
          className="border rounded p-2 w-full md:w-1/2"
        >
          <option value="resnet">ResNet</option>
          <option value="vgg">VGG</option>
        </select>
      </div>

      {/* Upload Section */}
      <div className="mt-4 flex flex-col sm:flex-row items-start gap-4">
        {/* File Input and Selected File Name */}
        <div className="flex flex-col w-full sm:w-2/3">
          <label htmlFor="fileInput" className="block mb-2 font-medium">
            Select Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="fileInput"
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex items-end sm:items-center w-full sm:w-1/3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded text-white w-full sm:w-auto ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Display the images and results side by side */}
      {(imagePreview || heatmapImage || result) && (
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Left Column: Uploaded Image */}
          <div className="flex-1">
            {imagePreview && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Original Image:</h3>
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="w-full h-auto border rounded shadow"
                />
              </div>
            )}
          </div>

          {/* Right Column: Heatmap and Result */}
          <div className="flex-1 flex flex-col gap-4">
            {heatmapImage && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Heatmap:</h3>
                <img
                  src={heatmapImage}
                  alt="Heatmap"
                  className="w-full h-auto border rounded shadow"
                />
              </div>
            )}
            {result && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Result:</h3>
                <pre className="bg-black-100 p-4 rounded whitespace-pre-wrap">
                  {result}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
