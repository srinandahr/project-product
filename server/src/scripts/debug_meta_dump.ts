import axios from 'axios';
import fs from 'fs';

const debugMeta = async () => {
    const url = "https://www.metacareers.com/jobs";
    try {
        console.log(`Fetching ${url}...`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });
        console.log('Status:', response.status);
        fs.writeFileSync('meta_dump.html', response.data);
        console.log('Saved to meta_dump.html');
    } catch (e: any) {
        console.error('Error:', e.message);
    }
};

debugMeta();
