import { ScraperStrategy, JobResult } from '../ScraperInterface';

export class MockScraper implements ScraperStrategy {
    private companyName: string;

    constructor(companyUrl: string) {
        if (companyUrl.includes('google')) this.companyName = 'Google';
        else if (companyUrl.includes('apple')) this.companyName = 'Apple';
        else if (companyUrl.includes('amazon')) this.companyName = 'Amazon';
        else if (companyUrl.includes('nvidia')) this.companyName = 'Nvidia';
        else if (companyUrl.includes('amd')) this.companyName = 'AMD';
        else if (companyUrl.includes('stripe')) this.companyName = 'Stripe';
        else if (companyUrl.includes('aexp')) this.companyName = 'American Express';
        else if (companyUrl.includes('paypal')) this.companyName = 'PayPal';
        else this.companyName = 'Tech Company';
    }

    async scrape(url: string): Promise<JobResult[]> {
        // Sophisticated mock to simulate real scanning
        const titles = [
            `Senior Software Engineer - ${this.companyName} Cloud`,
            `Full Stack Developer - ${this.companyName} Payments`,
            `Machine Learning Engineer - AI Platform`,
            `Frontend Engineer - Design Systems`,
            `Backend Engineer - Distributed Systems`,
            `DevOps Engineer - Infrastructure`,
            `Product Manager - Technical`,
            `Data Scientist - Analytics`,
            `Security Engineer - InfoSec`,
            `iOS Developer - Mobile App`
        ];

        return titles.map((title, index) => ({
            company: this.companyName,
            title: title,
            location: 'Bangalore, India',
            jobUrl: url, // Redirect user to the main career page as deep links are mocked
            description: `Join the ${this.companyName} team. Strong proficiency in algorithms and data structures required. Experience with distributed systems is a plus. (Simulated Recommendation for Demo)`
        }));
    }
}
