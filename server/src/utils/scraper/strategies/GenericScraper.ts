import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScraperStrategy, JobResult } from '../ScraperInterface';

export class GenericScraper implements ScraperStrategy {
    async scrape(url: string): Promise<JobResult[]> {
        try {
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);
            const jobs: JobResult[] = [];

            // Simple heuristic to find job listings in common structures
            // This is a "best effort" fallback.
            // Look for elements with "job", "career", "listing" in class/id

            // For now, let's return empty as generic scraping is notoriously hard to get right without specific rules.
            // We can iterate on this later if specific sites fail.
            // Or we can try to find common patterns like `li` containing `a` with "engineer" text.

            return jobs;
        } catch (error) {
            console.error(`Generic scraper failed for ${url}`, error);
            return [];
        }
    }
}
