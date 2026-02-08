import { ScraperStrategy } from './ScraperInterface';
import { PuppeteerScraper } from './strategies/PuppeteerScraper';
import { MockScraper } from './strategies/MockScraper';

export class ScraperFactory {
    static getScraper(url: string): ScraperStrategy {
        // Use Puppeteer for the hard sites
        if (url.includes('eightfold.ai') || url.includes('metacareers.com') || url.includes('google.com')) {
            return new PuppeteerScraper();
        }

        // Fallback or specific strategies for others
        return new MockScraper(url);
    }
}
