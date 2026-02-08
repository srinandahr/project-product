import { PuppeteerScraper } from '../utils/scraper/strategies/PuppeteerScraper';

const testPuppeteer = async () => {
    const scraper = new PuppeteerScraper();

    // Test Nvidia (Eightfold)
    console.log('Testing Nvidia...');
    const nvidiaJobs = await scraper.scrape('https://nvidia.eightfold.ai/careers?start=0&location=Bengaluru%2C++KA%2C++India&pid=893392069435&sort_by=distance&filter_distance=160&filter_include_remote=1');
    console.log('Nvidia Jobs (URLs):', nvidiaJobs.slice(0, 3).map(j => j.jobUrl));

    // Test Paypal (Eightfold)
    console.log('Testing Paypal...');
    const paypalJobs = await scraper.scrape('https://paypal.eightfold.ai/careers?start=0&location=Bangalore&pid=274916855500&sort_by=timestamp');
    console.log('Paypal Jobs (URLs):', paypalJobs.slice(0, 3).map(j => ({ c: j.company, u: j.jobUrl })));

    // Test Google
    console.log('Testing Google...');
    const googleJobs = await scraper.scrape('https://www.google.com/about/careers/applications/jobs/results?location=Bengaluru%2C%20India&sort_by=date&target_level=ADVANCED&target_level=MID&target_level=EARLY#!t=jo&jid=127025001&');
    console.log('Google Jobs (URLs):', googleJobs.slice(0, 3).map(j => ({ c: j.company, u: j.jobUrl })));
};

testPuppeteer();
