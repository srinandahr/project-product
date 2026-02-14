import fs from 'fs';
const pdf = require('pdf-parse');

export const parseResume = async (input: string | Buffer): Promise<string> => {
    try {
        let dataBuffer: Buffer;

        if (Buffer.isBuffer(input)) {
            dataBuffer = input;
        } else {
            // It's a file path
            dataBuffer = fs.readFileSync(input);
        }

        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing resume:', error);
        throw new Error('Failed to parse resume');
    }
};
