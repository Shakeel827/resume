import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Filter,
  Briefcase,
  Users,
  Star,
  ExternalLink,
  BookmarkPlus,
  Bookmark,
  TrendingUp,
  Award,
  Target,
  Zap,
  Building,
  Globe,
  Heart,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { searchJobs, getRecommendedJobs, Job, fetchJobsFromRapidAPI, fetchSmartJobsFromInternet, recordUserJobSearch } from '../services/jobService';
import { ResumeData } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';
import { analyzeResumeWithAI, getCareerInsights } from '../services/aiService';
import { getJobMarketAnalytics } from '../services/jobService';
import { getJobRecommendationsWithAI } from '../services/geminiService';

interface CareerPortalProps {
  isLoggedIn: boolean;
  resumeData?: ResumeData;
  onLogin: () => void;
}

const CareerPortal: React.FC<CareerPortalProps> = ({ isLoggedIn, resumeData, onLogin }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    experience: '',
    remote: undefined as boolean | undefined,
    skills: [] as string[]
  });
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'recommended' | 'saved'>('search');
  const [showRapidApiJobs, setShowRapidApiJobs] = useState(true);
  const [showSmartInternetJobs, setShowSmartInternetJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [careerInsights, setCareerInsights] = useState<any>(null);
  const [marketAnalytics, setMarketAnalytics] = useState<any>(null);

  useEffect(() => {
    if (isLoggedIn) {
      loadJobs();
      loadRecommendedJobs();
      loadSavedJobs();
      loadCareerInsights();
      loadMarketAnalytics();
    }
  }, [isLoggedIn]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      let results: Job[] = [];
      // Fetch local jobs
      results = await searchJobs(searchQuery, filters);
      let rapidJobs: Job[] = [];
      let smartJobs: Job[] = [];
      if (showSmartInternetJobs) {
        // Fetch smart jobs from internet
        const smartResults = await fetchSmartJobsFromInternet();
        // Map/normalize smart jobs to Job type if needed
        smartJobs = (smartResults || []).map((item: any, idx: number) => ({
          id: `smartapi-${item.job_id || idx}`,
          title: item.job_title || item.title || 'Job',
          company: item.employer_name || item.company_name || 'Company',
          location: item.job_city || item.location || 'Unknown',
          type: item.job_employment_type || 'full-time',
          experience: item.job_required_experience || 'N/A',
          salary: item.estimated_salary || item.salary || '',
          description: item.job_description || item.description || '',
          requirements: item.job_required_skills || [],
          posted: item.job_posted_at_datetime_utc || 'Recently',
          url: item.job_apply_link || item.url || '#',
          logo: item.employer_logo || '',
          remote: item.job_is_remote || false,
          skills: item.job_required_skills || [],
        }));
      } else if (showRapidApiJobs) {
        // Fetch from RapidAPI for more jobs
        const rapidApiResults = await fetchJobsFromRapidAPI({
          jobTitle: searchQuery || 'developer',
          location: filters.location || 'India',
          locationType: 'ANY',
          yearsOfExperience: 'ALL',
        });
        if (rapidApiResults && rapidApiResults.data) {
          rapidJobs = rapidApiResults.data.map((item: any, idx: number) => ({
            id: `rapidapi-${item.job_id || idx}`,
            title: item.job_title || item.title || 'Job',
            company: item.employer_name || item.company_name || 'Company',
            location: item.job_city || item.location || 'Unknown',
            type: item.job_employment_type || 'full-time',
            experience: item.job_required_experience || 'N/A',
            salary: item.estimated_salary || item.salary || '',
            description: item.job_description || item.description || '',
            requirements: item.job_required_skills || [],
            posted: item.job_posted_at_datetime_utc || 'Recently',
            url: item.job_apply_link || item.url || '#',
            logo: item.employer_logo || '',
            remote: item.job_is_remote || false,
            skills: item.job_required_skills || [],
          }));
        }
      }
      setJobs([...results, ...rapidJobs, ...smartJobs]);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedJobs = async () => {
    if (resumeData?.skills && resumeData.skills.length > 0) {
      try {
        // Use AI-powered job recommendations
        const aiRecommendations = await getJobRecommendationsWithAI(resumeData.skills);
        const convertedJobs = aiRecommendations.map((job, index) => ({
          id: `ai-${index}`,
          title: job.title,
          company: job.company,
          location: job.location,
          type: 'full-time' as const,
          experience: 'Based on your skills',
          salary: job.salary,
          description: job.description,
          requirements: job.requirements,
          posted: 'AI Recommended',
          url: job.url,
          logo: '',
          remote: false,
          skills: job.requirements
        }));
        setRecommendedJobs(convertedJobs);
      } catch (error) {
        console.error('Failed to load recommended jobs');
        // Fallback to local recommendations
        const recommended = await getRecommendedJobs(
          resumeData.skills,
          resumeData.experience[0]?.duration || '0-2 years'
        );
        setRecommendedJobs(recommended);
      }
    }
  };

  const loadSavedJobs = () => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  };

  const loadCareerInsights = async () => {
    try {
      const insights = await getCareerInsights(resumeData);
      setCareerInsights(insights);
    } catch (error) {
      console.error('Failed to load career insights:', error);
    }
  };

  const loadMarketAnalytics = async () => {
    try {
      const analytics = getJobMarketAnalytics();
      setMarketAnalytics(analytics);
    } catch (error) {
      console.error('Failed to load market analytics:', error);
    }
  };

  const handleSearch = () => {
    recordUserJobSearch(searchQuery, filters.location);
    loadJobs();
  };

  const toggleSaveJob = (jobId: string) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
    
    toast.success(
      savedJobs.includes(jobId) ? 'Job removed from saved' : 'Job saved successfully!'
    );
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'internship': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const JobCard: React.FC<{ job: Job; isRecommended?: boolean }> = ({ job, isRecommended }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {job.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              {job.company}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isRecommended && (
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>Recommended</span>
            </div>
          )}
          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`p-2 rounded-lg transition-colors ${
              savedJobs.includes(job.id)
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            }`}
          >
            {savedJobs.includes(job.id) ? (
              <Bookmark className="w-5 h-5" />
            ) : (
              <BookmarkPlus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 text-sm">
          <Clock className="w-4 h-4" />
          <span>{job.posted}</span>
        </div>
        {job.salary && (
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 text-sm">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
        )}
        {job.remote && (
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Remote
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getJobTypeColor(job.type)}`}>
          {job.type.replace('-', ' ')}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {job.experience}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 3).map((skill, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1 rounded-md text-xs font-medium"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">4.8</span>
        </div>
        
        <motion.a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            if (job.url && job.url !== '#') {
              window.open(job.url, '_blank', 'noopener,noreferrer');
            } else {
              toast.error('Application link not available');
            }
          }}
        >
          <span>Apply Now</span>
          <ExternalLink className="w-4 h-4" />
        </motion.a>
      </div>
    </motion.div>
  );

  if (!isLoggedIn) {
    return (
      <section id="careers" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Unlock Your Career Potential
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Access 200+ job opportunities tailored to your skills and experience. 
              Get personalized recommendations and apply directly to top companies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              {[
                {
                  icon: Target,
                  title: 'Personalized Matches',
                  description: 'AI-powered job recommendations based on your resume'
                },
                {
                  icon: TrendingUp,
                  title: '200+ Opportunities',
                  description: 'Fresh job listings from top Indian companies'
                },
                {
                  icon: Award,
                  title: 'Career Growth',
                  description: 'Track applications and get interview tips'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <Users className="w-6 h-6" />
              <span>Login to Access Career Portal</span>
            </motion.button>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Free registration • No spam • Secure & private
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="careers" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Career Portal
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover opportunities that match your skills and aspirations. 
            200+ jobs from top companies waiting for you.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { icon: Briefcase, label: 'Active Jobs', value: '200+', color: 'from-blue-500 to-blue-600' },
            { icon: Building, label: 'Companies', value: '50+', color: 'from-green-500 to-green-600' },
            { icon: Users, label: 'Hired', value: '1000+', color: 'from-purple-500 to-purple-600' },
            { icon: Heart, label: 'Success Rate', value: '85%', color: 'from-red-500 to-red-600' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg text-center"
            >
              <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                <option value="bangalore">Bangalore</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="hyderabad">Hyderabad</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>

              {/* Smart Internet Jobs Toggle Button */}

              {/* RapidAPI Toggle Button (disabled if Smart is ON) */}
              <button
                type="button"
                onClick={() => { setShowRapidApiJobs(v => !v); setTimeout(handleSearch, 0); }}
                className={`px-4 py-3 rounded-lg font-medium border transition-all ${showRapidApiJobs && !showSmartInternetJobs ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-500 border-gray-300'} hover:shadow-md`}
                aria-pressed={showRapidApiJobs && !showSmartInternetJobs}
                aria-label="Toggle RapidAPI jobs"
                disabled={showSmartInternetJobs}
              >
                {showRapidApiJobs && !showSmartInternetJobs ? 'Showing RapidAPI Jobs' : 'Only Local Jobs'}
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-8 w-fit"
        >
          {[
            { id: 'search', label: 'All Jobs', count: jobs.length },
            { id: 'recommended', label: 'Recommended', count: recommendedJobs.length },
            { id: 'saved', label: 'Saved', count: savedJobs.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </motion.div>

        {/* Jobs Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {activeTab === 'search' && jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              
              {activeTab === 'recommended' && recommendedJobs.map((job) => (
                <JobCard key={job.id} job={job} isRecommended />
              ))}
              
              {activeTab === 'saved' && jobs
                .filter(job => savedJobs.includes(job.id))
                .map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {!loading && (
          (activeTab === 'search' && jobs.length === 0) ||
          (activeTab === 'recommended' && recommendedJobs.length === 0) ||
          (activeTab === 'saved' && savedJobs.length === 0)
        ) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  location: '',
                  type: '',
                  experience: '',
                  remote: undefined,
                  skills: []
                });
                handleSearch();
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CareerPortal;