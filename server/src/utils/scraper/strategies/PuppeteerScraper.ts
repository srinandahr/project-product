import { ScraperStrategy, JobResult } from '../ScraperInterface';
import puppeteer from 'puppeteer';

export class PuppeteerScraper implements ScraperStrategy {
    async scrape(url: string): Promise<JobResult[]> {
        console.log(`[Puppeteer] Starting scrape for ${url}`);
        let browser;
        try {
            const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath();
            console.log(`[Puppeteer] Executable path is: ${execPath}`);

            if (execPath) {
                const fs = require('fs');
                if (!fs.existsSync(execPath)) {
                    console.error(`[Puppeteer] Error: Executable not found at ${execPath}`);
                    throw new Error(`Browser executable not found at ${execPath}. Please run "npx puppeteer browsers install chrome"`);
                }
            }

            browser = await puppeteer.launch({
                headless: true,
                dumpio: true, // Log browser errors to console
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--no-first-run',
                    '--no-zygote'
                ],
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
            });
            const page = await browser.newPage();

            // Optimize: Block images, fonts, css to save memory
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            // Set realistic User-Agent
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

            // Capture browser console logs
            page.on('console', msg => console.log('PAGE LOG:', msg.text()));

            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            // Logic for different domains
            let jobs: JobResult[] = [];

            if (url.includes('nvidia.eightfold.ai')) {
                jobs = await this.scrapeEightfold(page, url, 'Nvidia');
            } else if (url.includes('aexp.eightfold.ai')) {
                jobs = await this.scrapeEightfold(page, url, 'American Express');
            } else if (url.includes('paypal.eightfold.ai')) {
                jobs = await this.scrapeEightfold(page, url, 'Paypal');
            } else if (url.includes('metacareers.com')) {
                jobs = await this.scrapeMeta(page, url);
            } else if (url.includes('google.com')) {
                jobs = await this.scrapeGoogle(page, url);
            } else {
                // Try generic if no specific match, or check other patterns
                if (url.includes('eightfold.ai')) {
                    jobs = await this.scrapeEightfold(page, url, 'Company');
                }
            }

            console.log(`[Puppeteer] Found ${jobs.length} jobs`);
            return jobs;

        } catch (error) {
            console.error(`[Puppeteer] Error scraping ${url}:`, error);
            return [];
        } finally {
            if (browser) await browser.close();
        }
    }

    private async scrapeEightfold(page: any, url: string, company: string): Promise<JobResult[]> {
        console.log(`[Puppeteer] Navigating to ${url} for ${company}`);
        // Wait for body to ensure page loaded
        await page.waitForSelector('body');

        // Try waiting for specific Eightfold elements
        try {
            await page.waitForSelector('.position-card, .job-card, tr.data-row', { timeout: 10000 });
        } catch (e) {
            console.log('[Puppeteer] Timeout waiting for specific job selectors. Page might be using Shadow DOM or different structure.');
        }

        return await page.evaluate((url: string, company: string) => {
            console.log('Evaluating page content inside browser...');
            const jobs: any[] = [];

            // Try very broad selectors to find ANY list items
            const potentialCards = document.querySelectorAll('div, tr, li');
            console.log(`Scanning ${potentialCards.length} elements for job-like structures...`);

            potentialCards.forEach((card: any) => {
                // Heuristic: A card usually has a link with a title and a location
                const titleEl = card.querySelector('.position-title, h3, h4, a.job-title, a[data-test-id="position-title"], a');
                const text = card.innerText || '';

                // naive filter to reduce noise: must look like a job title
                if (titleEl && (text.includes('Engineer') || text.includes('Developer') || text.includes('Manager'))) {
                    // Check if it looks like a job card (has location data?)
                    const locEl = card.querySelector('.location, .position-location') ||
                        Array.from(card.querySelectorAll('span, div')).find((el: any) => el.innerText && (el.innerText.includes('India') || el.innerText.includes('Remote') || el.innerText.includes('Bengaluru') || el.innerText.includes('Bangalore')));

                    if (locEl) {
                        let link = titleEl.getAttribute('href');
                        // If the title element itself isn't the link, check parent or children
                        if (!link) {
                            const parentLink = titleEl.closest('a');
                            if (parentLink) link = parentLink.getAttribute('href');
                        }
                        if (!link) {
                            const childLink = titleEl.querySelector('a');
                            if (childLink) link = childLink.getAttribute('href');
                        }

                        // Resolve relative URLs
                        let jobUrl = url;
                        if (link) {
                            if (link.startsWith('http')) {
                                jobUrl = link;
                            } else {
                                // Construct absolute URL carefully, handling leading slash
                                const baseUrl = new URL(url).origin;
                                jobUrl = baseUrl + (link.startsWith('/') ? '' : '/') + link;
                            }
                        }

                        jobs.push({
                            company: company,
                            title: titleEl.innerText.trim(),
                            location: locEl.innerText.trim(),
                            jobUrl: jobUrl,
                            description: 'Real job scraped'
                        });
                    }
                }
            });

            // Deduplicate based on URL
            const uniqueJobs = jobs.filter((v, i, a) => a.findIndex(t => (t.jobUrl === v.jobUrl)) === i);
            return uniqueJobs.slice(0, 10);
        }, url, company);
    }

    private async scrapeMeta(page: any, url: string): Promise<JobResult[]> {
        return await page.evaluate((url: string) => {
            const jobs: any[] = [];
            // Meta uses div structures mostly. 
            const cards = document.querySelectorAll('div[role="heading"], h4, a');

            cards.forEach((el: any) => {
                const text = el.innerText || '';
                if (text.includes('Engineer') || text.includes('Manager')) {
                    // Try to find the link
                    let link = el.getAttribute('href');
                    if (!link) {
                        const parent = el.closest('a');
                        if (parent) link = parent.getAttribute('href');
                    }

                    if (link) {
                        let jobUrl = link;
                        if (!link.startsWith('http')) {
                            jobUrl = 'https://www.metacareers.com' + (link.startsWith('/') ? '' : '/') + link;
                        }

                        jobs.push({
                            company: 'Meta',
                            title: text.split('\n')[0], // often title is first line
                            location: 'Bangalore, India', // heuristic
                            jobUrl: jobUrl,
                            description: 'Real job scraped from Meta Careers'
                        });
                    }
                }
            });

            const uniqueJobs = jobs.filter((v, i, a) => a.findIndex(t => (t.jobUrl === v.jobUrl)) === i);
            return uniqueJobs.slice(0, 10);
        }, url);
    }

    private async scrapeGoogle(page: any, url: string): Promise<JobResult[]> {
        return await page.evaluate((url: string) => {
            const jobs: any[] = [];
            const items = document.querySelectorAll('li, div[role="listitem"]');
            items.forEach((item: any) => {
                const title = item.querySelector('h3');
                if (title) {
                    // Google usually has deeper structure
                    let link = item.querySelector('a')?.getAttribute('href');
                    let jobUrl = url;
                    if (link) {
                        // Google careers usually absolute or relative
                        if (!link.startsWith('http')) {
                            jobUrl = 'https://www.google.com/about/careers/applications/' + link;
                        } else {
                            jobUrl = link;
                        }
                    }

                    jobs.push({
                        company: 'Google',
                        title: title.innerText,
                        location: 'Bangalore, India',
                        jobUrl: jobUrl,
                        description: 'Real job scraped from Google Careers'
                    });
                }
            });
            return jobs;
        }, url);
    }
}
