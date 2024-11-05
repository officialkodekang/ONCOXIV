// // app/blog/page.tsx
// "use client";

// import React, { useState } from 'react';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Metadata } from "next";
// import Image from "next/image";
// import Link from "next/link";



// export default function BlogIndexPage() {
//   // State variables for the upload functionality
//   const [file, setFile] = useState<File | null>(null);
//   const [results, setResults] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Event handlers
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setFile(event.target.files[0]);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!file) {
//       alert("Please select a file first!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     setLoading(true);
//     try {
//       const response = await fetch("/api/process-image", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       setResults(JSON.stringify(data, null, 2));
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to upload image");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="w-full mx-auto flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
//       <div className="mb-7 flex flex-col gap-2">
//         <h1 className="text-3xl font-extrabold">Upload an Image</h1>
//         <p className="text-muted-foreground">
//           Upload your image and process it here.
//         </p>
//       </div>

//       {/* Upload Section */}
//       <div>
//         <input type="file" onChange={handleFileChange} />
//         <button onClick={handleSubmit} disabled={loading}>
//           {loading ? "Processing..." : "Submit"}
//         </button>
//         {results && (
//           <div>
//             <h3>Results:</h3>
//             <pre>{results}</pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






// app/blog/page.tsx
"use client";

import React, { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [heatmapImage, setHeatmapImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState('vgg'); // Default model

  // Label maps with numeric keys
  const binaryLabelMap: { [key: number]: string } = {
    0: 'Benign',
    1: 'Malignant',
  };

  const subtypeLabelMap: { [key: number]: string } = {
    [-1]: 'Not applicable',
    0: 'Pre-B',
    1: 'Pro-B',
    2: 'early Pre-B',
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      // Generate a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
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
        throw new Error(`Server Error: ${response.status} - ${errorData.error}`);
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
      const binaryLabel = binaryLabelMap[data.binary_class_id] || 'Unknown';
      const subtypeLabel = subtypeLabelMap[data.subtype_class_id] || 'Unknown';

      const resultText = `Binary Classification: ${binaryLabel}\nSubtype Classification: ${subtypeLabel}`;

      setResult(resultText);

      // Set the heatmap image
      if (data.heatmap) {
        const heatmapSrc = data.heatmap.startsWith('data:image')
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
    <div className="w-full mx-auto flex flex-col gap-4 sm:min-h-[91vh] min-h-[88vh] pt-4">
      <div className="mb-7 flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold">Upload an Image</h1>
        <p className="text-muted-foreground">
          Upload your image and process it here.
        </p>
      </div>

      {/* Model Selection */}
      <div>
        <label htmlFor="modelSelect">Select Model:</label>
        <select id="modelSelect" value={selectedModel} onChange={handleModelChange}>
          <option value="vgg">VGG</option>
          <option value="resnet">ResNet</option>
        </select>
      </div>

      {/* Upload Section */}
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>

      {/* Display the uploaded image */}
      {imagePreview && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imagePreview} alt="Uploaded" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      )}

      {/* Display the result */}
      {result && (
        <div>
          <h3>Result:</h3>
          <pre>{result}</pre>
        </div>
      )}

      {/* Display the heatmap image */}
      {heatmapImage && (
        <div>
          <h3>Heatmap:</h3>
          <img src={heatmapImage} alt="Heatmap" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      )}
    </div>
  );
}


