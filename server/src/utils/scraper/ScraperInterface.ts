export interface JobResult {
    company: string;
    title: string;
    location: string;
    jobUrl: string;
    description?: string;
}

export interface ScraperStrategy {
    scrape(url: string): Promise<JobResult[]>;
}
