import axios from 'axios';
import { ScraperStrategy, JobResult } from '../ScraperInterface';

export class EightfoldScraper implements ScraperStrategy {
    async scrape(url: string): Promise<JobResult[]> {
        // Eightfold sites usually load data via API. 
        // Example URL: https://nvidia.eightfold.ai/careers?location=...
        // API Endpoint often: https://nvidia.eightfold.ai/api/apply/v2/jobs

        try {
            const domain = new URL(url).hostname; // e.g. nvidia.eightfold.ai
            const apiUrl = `https://${domain}/api/apply/v2/jobs`;

            // We need to parse query params from the provided URL to filter?
            // User provided full search URLs. We might need to extract 'domain' and just hit values.
            // Or we can just fetch the top jobs.

            // Let's try fetching 10-20 jobs.
            const response = await axios.get(apiUrl, {
                params: {
                    domain: domain.split('.')[0], // nvidia from nvidia.eightfold.ai? 
                    // Verify actual API needed. Eightfold usually just needs GET /api/apply/v2/jobs?domain=nvidia.com
                }
            });

            // NOTE: This is a hypothesis. We'll need to verify the exact API structure for each Eightfold site.
            // Reverting to a simple "fetch whatever" approach for now.
            // Let's assume user just wants to scrape the specific page provided.

            return [];
        } catch (error) {
            console.error(`Eightfold scraper failed for ${url}`, error);
            return [];
        }
    }
}
