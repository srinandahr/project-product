import { ScraperStrategy } from './ScraperInterface';
import { PuppeteerScraper } from './strategies/PuppeteerScraper';
import { MockScraper } from './strategies/MockScraper';

export class ScraperFactory {
    static getScraper(url: string): ScraperStrategy {
        // Use Puppeteer for everything now to avoid mock data
        return new PuppeteerScraper();
    }
}
