import axios from 'axios';

const testGoogle = async () => {
    // Google Careers internal API often used:
    // https://careers.google.com/api/v3/search/?degree=BACHELORS&degree=MASTERS&degree=PHD&distance=50&location=Bangalore%2C%20India&q=&sort_by=relevance

    const url = "https://careers.google.com/api/v3/search/?degree=BACHELORS&degree=MASTERS&distance=50&location=Bangalore%2C%20India&q=software&sort_by=relevance";
    try {
        console.log(`Fetching ${url}...`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        console.log('Status:', response.status);
        console.log('Data keys:', Object.keys(response.data));
        if (response.data.jobs) {
            console.log('Found jobs:', response.data.jobs.length);
            console.log('Sample Job:', response.data.jobs[0].title);
        }
    } catch (e: any) {
        console.error('Error:', e.message);
    }
};

testGoogle();
