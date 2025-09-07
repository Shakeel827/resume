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
  ChevronUp,
  Wifi,
  WifiOff,
  Share2,
  Copy
} from 'lucide-react';
import { searchJobs, getJobMarketAnalytics, Job, shareJob } from '../services/jobService';
import toast from 'react-hot-toast';

const CareerPortal: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
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
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [marketAnalytics, setMarketAnalytics] = useState<any>(null);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    checkAPIConnection();
    loadJobs();
    loadSavedJobs();
    loadMarketAnalytics();
  }, []);

  const checkAPIConnection = async () => {
    try {
      const response = await fetch('https://api-lzkz.onrender.com/jobs');
      setApiConnected(response.ok);
      if (!response.ok) {
        toast.error('API connection failed. Please ensure localhost:8009 is running.');
      }
    } catch (error) {
      setApiConnected(false);
      toast.error('API connection failed. Please ensure localhost:8009 is running.');
    }
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const results = await searchJobs(searchQuery, filters);
      setJobs(results);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs. Please check API connection.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMarketAnalytics = async () => {
    try {
      const analytics = await getJobMarketAnalytics();
      setMarketAnalytics(analytics);
    } catch (error) {
      console.error('Failed to load market analytics:', error);
      setMarketAnalytics({
        totalJobs: 0,
        trendingSkills: ['JavaScript', 'React', 'Python', 'Node.js'],
        topCompanies: ['Google', 'Microsoft', 'Amazon', 'Flipkart'],
        averageSalary: '₹12-25 LPA',
        growthRate: '15%'
      });
    }
  };

  const loadSavedJobs = () => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      try {
        setSavedJobs(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved jobs:', error);
        setSavedJobs([]);
      }
    }
  };

  const handleSearch = async () => {
    await loadJobs();
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

  const handleApplyNow = (job: Job) => {
    if (job.application_link || job.url) {
      const applyUrl = job.application_link || job.url;
      if (applyUrl && applyUrl !== '#') {
        window.open(applyUrl, '_blank', 'noopener,noreferrer');
        toast.success('Redirecting to application page...');
      } else {
        toast.error('Application link not available');
      }
    } else {
      toast.error('Application link not available');
    }
  };

  const handleShareJob = (job: Job) => {
    const shareUrl = `${window.location.origin}/job/${job.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this job opportunity: ${job.title} at ${job.company}`,
        url: shareUrl,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success('Job link copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Job link copied to clipboard!');
      });
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'part-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'contract': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
      case 'internship': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const JobCard: React.FC<{ job: Job }> = ({ job }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <Building className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
              {job.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium truncate">
              {job.company}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => handleShareJob(job)}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
            aria-label="Share job"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`p-2 rounded-lg transition-colors ${
              savedJobs.includes(job.id)
                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            }`}
            aria-label={savedJobs.includes(job.id) ? 'Remove from saved' : 'Save job'}
          >
            {savedJobs.includes(job.id) ? (
              <Bookmark className="w-5 h-5" />
            ) : (
              <BookmarkPlus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 text-sm">
        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{job.posted}</span>
        </div>
        {job.salary && job.salary !== 'Competitive' && (
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
            <DollarSign className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{job.salary}</span>
          </div>
        )}
        {job.remote && (
          <div className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
            Remote
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getJobTypeColor(job.type)}`}>
          {job.type.replace('-', ' ')}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
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
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleApplyNow(job)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
        >
          <span>Apply Now</span>
          <ExternalLink className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <section id="careers" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with API Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Career Portal
            </h2>
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
              apiConnected 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
            }`}>
              {apiConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{apiConnected ? 'Live API' : 'API Offline'}</span>
            </div>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover opportunities that match your skills and aspirations. 
            {apiConnected ? 'Live job data from localhost:8009 API.' : 'Please start your API server.'}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12"
        >
          {[
            { icon: Briefcase, label: 'Active Jobs', value: marketAnalytics?.totalJobs || jobs.length || '0', color: 'from-blue-500 to-blue-600' },
            { icon: Building, label: 'Companies', value: marketAnalytics?.topCompanies?.length || '10+', color: 'from-green-500 to-green-600' },
            { icon: Users, label: 'Applications', value: '500+', color: 'from-purple-500 to-purple-600' },
            { icon: Heart, label: 'Success Rate', value: '85%', color: 'from-red-500 to-red-600' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 p-4 sm:p-6 rounded-2xl shadow-lg text-center"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
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
          className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
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
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 sm:py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="">All Locations</option>
                <option value="bangalore">Bangalore</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="pune">Pune</option>
                <option value="chennai">Chennai</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 sm:py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">Search</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={checkAPIConnection}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Wifi className="w-5 h-5" />
                <span className="hidden sm:inline">Test API</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-8 w-full sm:w-fit overflow-x-auto"
        >
          {[
            { id: 'search', label: 'All Jobs', count: jobs.length },
            { id: 'saved', label: 'Saved', count: savedJobs.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              <span className="ml-1">({tab.count})</span>
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
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">
                  {apiConnected ? 'Loading jobs from API...' : 'Checking API connection...'}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
            >
              {activeTab === 'search' && jobs.map((job) => (
                <JobCard key={job.id} job={job} />
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
              {activeTab === 'saved' ? 'No saved jobs' : 'No jobs found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {!apiConnected 
                ? 'API connection unavailable. Please ensure localhost:8009 is running.'
                : activeTab === 'saved'
                ? 'Save jobs to view them here later.'
                : 'Try adjusting your search criteria or check back later for new opportunities.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              {!apiConnected && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={checkAPIConnection}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Wifi className="w-5 h-5" />
                  <span>Retry Connection</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* API Status Info */}
        {!apiConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8"
          >
            <div className="flex items-center space-x-2">
              <WifiOff className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  API Connection Required
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Please ensure your backend API is running at localhost:8009 to see live job data.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CareerPortal;
