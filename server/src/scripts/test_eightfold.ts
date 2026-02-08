import axios from 'axios';

const testEightfold = async () => {
    const url = "https://nvidia.eightfold.ai/api/apply/v2/jobs?domain=nvidia.com&start=0&num=10&location=Bengaluru%2C%20India&sort_by=relevance";
    try {
        console.log(`Fetching ${url}...`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://nvidia.eightfold.ai/careers',
                'Origin': 'https://nvidia.eightfold.ai',
                'Accept': 'application/json, text/plain, */*'
            }
        });
        console.log('Status:', response.status);
        console.log('Data keys:', Object.keys(response.data));
        if (response.data.positions) {
            console.log('Found positions:', response.data.positions.length);
            console.log('Sample Job:', response.data.positions[0].name);
        }
    } catch (e: any) {
        console.error('Error:', e.message);
    }
};

testEightfold();
