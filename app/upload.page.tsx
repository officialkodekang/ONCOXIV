// pages/upload.page.tsx
import React, { useState } from 'react';

const UploadPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const response = await fetch('/api/process-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResults(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to upload image');
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Upload an Image</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Processing...' : 'Submit'}
            </button>
            {results && (
                <div>
                    <h3>Results:</h3>
                    <pre>{results}</pre>
                </div>
            )}
        </div>
    );
}

export default UploadPage;
