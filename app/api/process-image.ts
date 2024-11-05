// pages/api/process-image.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Formidable } from 'formidable';

export const config = {
    api: {
        bodyParser: false, // Important to disable the default body parser
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const form = new Formidable();

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error parsing the form:', err);
            res.status(500).json({ error: 'Error parsing the form data.' });
            return;
        }
        
        // Assuming files are stored in a 'file' field
        const file = files.file;

        if (!file) {
            res.status(400).json({ error: 'No file uploaded.' });
            return;
        }

        // Here you can handle the file, e.g., saving it to disk, processing it, or sending to another API
        res.status(200).json({ message: 'File uploaded successfully.', fileDetails: file });
    });
}
