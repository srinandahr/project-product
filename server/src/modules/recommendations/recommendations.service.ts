import prisma from '../../config/db';
import { ScraperFactory } from '../../utils/scraper/ScraperFactory';
import { parseResume } from '../../utils/resumeParser';
import natural from 'natural';

const tokenizer = new natural.WordTokenizer();

// Helper to calculate similarity score (0-100)
// Helper to calculate similarity score (0-100)
const calculateScore = (resumeText: string, jobDescription: string): number => {
    // Basic stop words to remove noise
    const stopWords = new Set(['and', 'the', 'is', 'in', 'at', 'of', 'or', 'a', 'an', 'to', 'for', 'with', 'on', 'as', 'by', 'are', 'be', 'this', 'that', 'it', 'from']);

    const tokenize = (text: string) => {
        return tokenizer.tokenize(text.toLowerCase())
            .filter(t => t.length > 2 && !stopWords.has(t));
    };

    const resumeTokens = new Set(tokenize(resumeText));
    const jobTokens = tokenize(jobDescription);

    if (!jobTokens || jobTokens.length === 0) return 0;

    let matchCount = 0;
    jobTokens.forEach(token => {
        if (resumeTokens.has(token)) matchCount++;
    });

    // Jaccard-like overlap: (matches / total_unique_job_tokens)
    const uniqueJobTokens = new Set(jobTokens).size;
    const score = (matchCount / uniqueJobTokens) * 100;

    return Math.round(score);
};

export const getDailyRecommendations = async (userId: string) => {
    // 1. Fetch User Resume (Must exist to show recommendations)
    const resume = await prisma.resume.findFirst({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' }
    });

    if (!resume) {
        // If no resume, we shouldn't show cached recs either.
        // Optionally clear them? For now, just throwing protects the view.
        throw new Error('No resume found. Please upload one first.');
    }

    // 2. Check if we already have today's recommendations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecs = await prisma.recommendedJob.findMany({
        where: {
            user_id: userId,
            created_at: { gte: today }
        }
    });

    if (existingRecs.length >= 10) {
        return existingRecs.slice(0, 10);
    }

    // 3. Parse Resume
    let resumeText = "";
    try {
        if (resume.data) {
            console.log(`Parsing resume from DB buffer. Size: ${resume.data.length}`);
            resumeText = await parseResume(resume.data);
        } else {
            console.log(`Parsing resume from file path: ${resume.file_url}`);
            // Fallback for legacy resumes stored on disk
            let filePath = resume.file_url;
            if (resume.file_url.startsWith('http')) {
                const filename = resume.file_url.split('/').pop();
                const path = require('path');
                if (filename) {
                    filePath = path.join(process.cwd(), 'uploads', 'resumes', filename);
                }
            }
            // Check if file exists before trying to parse
            const fs = require('fs');
            if (fs.existsSync(filePath)) {
                resumeText = await parseResume(filePath);
            } else {
                console.warn(`Resume file not found at ${filePath}, using default text.`);
                resumeText = "Software Engineer Javascript React Node.js Typescript";
            }
        }
        console.log(`Resume parsed successfully. Length: ${resumeText.length}`);
    } catch (e) {
        console.error('Resume parse failed, using fallback:', e);
        resumeText = "Software Engineer Javascript React Node.js Typescript Full Stack"; // Fallback
    }

    // 3. Scrape Jobs
    const targets = [
        "https://www.metacareers.com/jobsearch?sort_by_new=true&offices[0]=Bangalore%2C%20India",
        "https://www.amazon.jobs/content/en/locations/india/bangalore?category%5B%5D=Software+Development",
        "https://jobs.apple.com/en-in/search?location=bengaluru-BGS&team=apps-and-frameworks-SFTWR-AF+cloud-and-infrastructure-SFTWR-CLD+core-operating-systems-SFTWR-COS+devops-and-site-reliability-SFTWR-DSR+engineering-project-management-SFTWR-EPM+information-systems-and-technology-SFTWR-ISTECH+machine-learning-SFTWR-MCHLN+security-and-privacy-SFTWR-SEC+software-quality-automation-tools-SFTWR-SQAT+wireless-software-SFTWR-WSFT",
        "https://www.google.com/about/careers/applications/jobs/results?location=Bengaluru%2C%20India&sort_by=date&target_level=ADVANCED&target_level=MID&target_level=EARLY#!t=jo&jid=127025001&",
        "https://nvidia.eightfold.ai/careers?start=0&location=Bengaluru%2C++KA%2C++India&pid=893392069435&sort_by=distance&filter_distance=160&filter_include_remote=1",
        "https://careers.amd.com/careers-home/jobs?city=Bangalore&page=1&sortBy=posted_date&descending=true",
        "https://stripe.com/jobs/search?office_locations=Asia+Pacific--Bengaluru",
        "https://aexp.eightfold.ai/careers?location=Banguluru&pid=39315007&domain=aexp.com&sort_by=newest&hl=en",
        "https://paypal.eightfold.ai/careers?start=0&location=Bangalore&pid=274916855500&sort_by=timestamp&filter_distance=80&filter_include_remote=1&filter_job_category=Software+Engineering%2CMachine+Learning+Engineering%2CData+Engineering%2CDatabase+Engineering%2CEnterprise+Systems%2CTechnical+Program+Management%2CCybersecurity+Engineering%2CCybersecurity+Risk%2CCybersecurity+Operations%2CSystem+%26+Cloud+Engineering%2CSite+Reliability+Engineering%2CQuality+Engineering"
    ];

    let allJobs: any[] = [];

    // Parallel scraping
    const scrapePromises = targets.map(url => ScraperFactory.getScraper(url).scrape(url));
    const results = await Promise.all(scrapePromises);

    results.forEach(list => allJobs.push(...list));

    // 4. Score and Filter
    const scoredJobs = allJobs.map(job => ({
        ...job,
        score: calculateScore(resumeText, job.title + " " + (job.description || ""))
    }));

    // Filter > 10% (realistic overlap is often low) and take top 10
    const topJobs = scoredJobs
        .filter(j => j.score >= 10)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    // If not enough, fill with lower scores just to show something
    if (topJobs.length === 0 && scoredJobs.length > 0) {
        // Fallback: take top 3 regardless of score
        topJobs.push(...scoredJobs.sort((a, b) => b.score - a.score).slice(0, 3));
    }

    // 5. Store in DB
    const savedJobs = [];
    for (const job of topJobs) {
        const saved = await prisma.recommendedJob.create({
            data: {
                user_id: userId,
                company: job.company,
                title: job.title,
                job_url: job.jobUrl,
                location: job.location,
                score: job.score
            }
        });
        savedJobs.push(saved);
    }

    return savedJobs;
};

export const clearDailyRecommendations = async (userId: string) => {
    // Delete all recommendations for this user
    // We could filter by date, but "clear" usually implies "start over now"
    await prisma.recommendedJob.deleteMany({
        where: { user_id: userId }
    });
    return { message: 'Recommendations cleared' };
};
