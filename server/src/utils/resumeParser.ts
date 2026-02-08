import fs from 'fs';
const pdf = require('pdf-parse');

export const parseResume = async (filePath: string): Promise<string> => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing resume:', error);
        throw new Error('Failed to parse resume');
    }
};
