// Job Service - Single API Integration with localhost:8000
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  url: string;
  logo: string;
  remote: boolean;
  skills: string[];
}

export interface JobFilters {
  location?: string;
  type?: string;
  experience?: string;
  remote?: boolean;
  skills?: string[];
}

const API_BASE_URL = 'http://127.0.0.1:8001';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Main job search function
export const searchJobs = async (query: string = '', filters: JobFilters = {}): Promise<Job[]> => {
  const cacheKey = `search-${query}-${JSON.stringify(filters)}`;
  const cachedResult = getCachedData(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (filters.location) params.append('location', filters.location);
    if (filters.type) params.append('type', filters.type);
    if (filters.experience) params.append('experience', filters.experience);
    if (filters.remote !== undefined) params.append('remote', filters.remote.toString());
    if (filters.skills?.length) params.append('skills', filters.skills.join(','));

    const response = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const jobs = normalizeJobData(data.jobs || data.data || data || []);
    
    setCachedData(cacheKey, jobs);
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Return fallback local jobs if API fails
    return getFallbackJobs(query, filters);
  }
};

// Get recommended jobs based on skills
export const getRecommendedJobs = async (skills: string[], experience?: string): Promise<Job[]> => {
  const cacheKey = `recommended-${skills.join(',')}-${experience}`;
  const cachedResult = getCachedData(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/jobs/recommended`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        skills,
        experience,
        limit: 20
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const jobs = normalizeJobData(data.jobs || data.data || data || []);
    
    setCachedData(cacheKey, jobs);
    return jobs;
  } catch (error) {
    console.error('Error fetching recommended jobs:', error);
    // Fallback to search with skills
    return searchJobs(skills.join(' '), { skills });
  }
};

// Get job details by ID
export const getJobById = async (jobId: string): Promise<Job | null> => {
  const cacheKey = `job-${jobId}`;
  const cachedResult = getCachedData(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const job = normalizeJobData([data])[0] || null;
    
    if (job) {
      setCachedData(cacheKey, job);
    }
    
    return job;
  } catch (error) {
    console.error('Error fetching job details:', error);
    return null;
  }
};

// Get job market analytics
export const getJobMarketAnalytics = async () => {
  const cacheKey = 'market-analytics';
  const cachedResult = getCachedData(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analytics/market`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching market analytics:', error);
    return {
      totalJobs: 0,
      trendingSkills: ['JavaScript', 'React', 'Python', 'Node.js'],
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta'],
      averageSalary: '₹12-25 LPA',
      growthRate: '15%'
    };
  }
};

// Record user job search for analytics
export const recordUserJobSearch = async (query: string, location?: string) => {
  try {
    await fetch(`${API_BASE_URL}/analytics/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        location,
        timestamp: new Date().toISOString()
      }),
    });
  } catch (error) {
    console.error('Error recording search:', error);
    // Don't throw error for analytics
  }
};

// Normalize job data from API response
const normalizeJobData = (jobs: any[]): Job[] => {
  return jobs.map((job: any, index: number) => ({
    id: job.id || job.job_id || `job-${index}-${Date.now()}`,
    title: job.title || job.job_title || job.position || 'Job Position',
    company: job.company || job.company_name || job.employer_name || job.employer || 'Company',
    location: job.location || job.job_location || job.city || job.job_city || 'Location',
    type: job.type || job.job_type || job.employment_type || job.job_employment_type || 'full-time',
    experience: job.experience || job.experience_level || job.job_required_experience || 'Not specified',
    salary: job.salary || job.salary_range || job.estimated_salary || job.compensation || 'Competitive',
    description: job.description || job.job_description || job.summary || 'No description available',
    requirements: job.requirements || job.job_required_skills || job.skills || job.qualifications || [],
    posted: job.posted || job.posted_date || job.job_posted_at || job.date_posted || 'Recently',
    url: job.url || job.job_url || job.apply_url || job.job_apply_link || '#',
    logo: job.logo || job.company_logo || job.employer_logo || '',
    remote: job.remote || job.is_remote || job.job_is_remote || false,
    skills: job.skills || job.required_skills || job.job_required_skills || job.technologies || []
  }));
};

// Fallback jobs when API is unavailable
const getFallbackJobs = (query: string, filters: JobFilters): Job[] => {
  const fallbackJobs = [
    {
      id: 'fallback-1',
      title: 'Senior Software Engineer',
      company: 'Tech Solutions India',
      location: 'Bangalore, Karnataka',
      type: 'full-time',
      experience: '3-5 years',
      salary: '₹15-25 LPA',
      description: 'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for developing scalable web applications using modern technologies.',
      requirements: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      posted: '2 days ago',
      url: 'https://example.com/jobs/1',
      logo: '',
      remote: true,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
    },
    {
      id: 'fallback-2',
      title: 'Full Stack Developer',
      company: 'Innovation Labs',
      location: 'Mumbai, Maharashtra',
      type: 'full-time',
      experience: '2-4 years',
      salary: '₹12-20 LPA',
      description: 'Join our team as a Full Stack Developer and work on cutting-edge projects that impact millions of users.',
      requirements: ['React', 'Python', 'Django', 'PostgreSQL'],
      posted: '1 day ago',
      url: 'https://example.com/jobs/2',
      logo: '',
      remote: false,
      skills: ['React', 'Python', 'Django', 'PostgreSQL']
    },
    {
      id: 'fallback-3',
      title: 'Frontend Developer',
      company: 'Digital Innovations',
      location: 'Hyderabad, Telangana',
      type: 'full-time',
      experience: '1-3 years',
      salary: '₹8-15 LPA',
      description: 'Create beautiful and responsive user interfaces using modern frontend technologies.',
      requirements: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'],
      posted: '3 days ago',
      url: 'https://example.com/jobs/3',
      logo: '',
      remote: true,
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript']
    }
  ];

  // Filter fallback jobs based on query and filters
  return fallbackJobs.filter(job => {
    if (query && !job.title.toLowerCase().includes(query.toLowerCase()) && 
        !job.company.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.type && job.type !== filters.type) {
      return false;
    }
    if (filters.remote !== undefined && job.remote !== filters.remote) {
      return false;
    }
    return true;
  });
};

// Legacy function names for backward compatibility
export const fetchJobsFromRapidAPI = searchJobs;
export const fetchSmartJobsFromInternet = () => searchJobs('', {});
