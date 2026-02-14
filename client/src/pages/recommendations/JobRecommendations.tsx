import { useEffect, useState } from 'react';
import { useRecommendationsStore } from '../../store/recommendations.store';
import { Briefcase, ExternalLink, MapPin, Building, Star, AlertCircle } from 'lucide-react';

const JobRecommendations = () => {
    const { jobs, loading, error, fetchRecommendations } = useRecommendationsStore();
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const handleClear = () => {
        const { clearRecommendations } = useRecommendationsStore.getState();
        clearRecommendations();
        setShowConfirm(false);
    };

    if (error) {
        if (error.includes('No resume found')) {
            return (
                <div className="text-center py-12 bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in">
                    <div className="h-16 w-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Resume Missing
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                        We need your resume to find the best job matches for you. Please upload one to get started!
                    </p>
                    <a
                        href="/app/resumes"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Upload Resume
                    </a>
                </div>
            );
        }

        return (
            <div className="p-6 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <span>Error: {error}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in relative">
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 transform transition-all scale-100">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Refresh Recommendations?
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            This will clear your current recommendations and fetch a fresh batch. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        Daily Job Recommendations
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Top 10 picks for you based on your resume profile.
                    </p>
                </div>
                <button
                    onClick={() => setShowConfirm(true)}
                    className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Refresh Recommendations"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                        <path d="M16 16h5v5" />
                    </svg>
                </button>
            </header>

            {jobs.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No matches found yet
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        This might be because we're still analyzing your profile or scraping the latest jobs. Try again later!
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="group bg-white dark:bg-[#1e1e2e] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <span className={`
                                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${job.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                        job.score >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}
                                `}>
                                    <Star size={12} className="mr-1 fill-current" />
                                    {Math.round(job.score)}% Match
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <Building size={20} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 min-h-[56px]">
                                    {job.title}
                                </h3>
                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                    {job.company}
                                </p>
                            </div>

                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                                <MapPin size={14} className="mr-1.5" />
                                <span className="truncate">{job.location}</span>
                            </div>

                            <a
                                href={job.job_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Apply Now
                                <ExternalLink size={16} className="ml-2" />
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobRecommendations;
