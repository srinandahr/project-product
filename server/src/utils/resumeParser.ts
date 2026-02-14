import fs from 'fs';
const { PDFParse } = require('pdf-parse');

export const parseResume = async (input: string | Buffer): Promise<string> => {
    let parser;
    try {
        let dataBuffer: Buffer;

        if (Buffer.isBuffer(input)) {
            dataBuffer = input;
        } else {
            // It's a file path
            dataBuffer = fs.readFileSync(input);
        }

        parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        return result.text;
    } catch (error) {
        console.error('Error parsing resume:', error);
        throw new Error('Failed to parse resume');
    } finally {
        if (parser) {
            await parser.destroy();
        }
    }
};
