import axios from 'axios';

const testMeta = async () => {
    // Meta uses GraphQL or internal API.
    // Try fetching the main page and looking for JSON in script tags first, or a known API endpoint.
    // Actually, metacareers.com often hits `https://www.metacareers.com/graphql`

    // For now, let's try a simple GET to see if we can get the HTML and find the preloaded state.
    const url = "https://www.metacareers.com/jobs";
    try {
        console.log(`Fetching ${url}...`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        console.log('Status:', response.status);
        if (response.data.includes('job_search')) {
            console.log('Page content contains job_search keyword');
        }
    } catch (e: any) {
        console.error('Error:', e.message);
    }
};

testMeta();
