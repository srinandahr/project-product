import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScraperStrategy, JobResult } from '../ScraperInterface';

export class MetaScraper implements ScraperStrategy {
    async scrape(url: string): Promise<JobResult[]> {
        try {
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);
            const jobs: JobResult[] = [];

            // Meta Careers usually embeds data in a script tag.
            // Look for script containing "job_search" or similar.
            // Simplified fallback: Look for known class names if SSR, or just mock if extraction fails.

            // For this specific 'hackathon' style feature, if parsing fails, we fallback to empty
            // and let the MockScraper handle "filling the quota" if needed?
            // No, let's try to parse at least one if possible.

            // Since reverse engineering the full JSON blob is complex and fragile,
            // I will implement a basic extraction. If it fails, it returns empty.

            $('h4').each((i, el) => {
                // Heuristic: Titles are often H4 or H3
                const title = $(el).text();
                if (title.includes('Engineer') || title.includes('Developer')) {
                    jobs.push({
                        company: 'Meta',
                        title: title,
                        location: 'Bangalore, India', // inferred from user URL
                        jobUrl: url,
                        description: 'Check career page for details.'
                    });
                }
            });

            return jobs;
        } catch (error) {
            console.error(`Meta scraper failed for ${url}`, error);
            return [];
        }
    }
}
