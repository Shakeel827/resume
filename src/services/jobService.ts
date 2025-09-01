export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship';
  remote: boolean;
  skills: string[];
  source: 'rapidapi';
}

// Fetch jobs from RapidAPI
export const fetchJobsFromRapidAPI = async (pageNumber = 1, pageSize = 12): Promise<Job[]> => {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '03b3cf7493msh0a84fa633dc8487p10ae9djsn745e069e1ee4';
  const RAPIDAPI_HOST = 'job-postings1.p.rapidapi.com';

  const response = await fetch(`https://job-postings1.p.rapidapi.com/?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': RAPIDAPI_KEY
    }
  });

  const data = await response.json();

  return data.map((job: any) => ({
    id: job.id || Math.random().toString(36).substring(2),
    title: job.title || 'Unknown',
    company: job.company || 'Unknown',
    description: job.description || '',
    location: job.location || 'Unknown',
    type: job.type?.toLowerCase() as 'full-time' | 'part-time' | 'internship' || 'full-time',
    remote: job.remote ?? false,
    skills: job.skills || [],
    source: 'rapidapi'
  }));
};

// Search and filter
export const searchJobs = async (query = '', filters: any = {}): Promise<Job[]> => {
  let jobs = await fetchJobsFromRapidAPI();
  
  if (query) {
    const terms = query.toLowerCase().split(' ');
    jobs = jobs.filter(job => {
      const text = `${job.title} ${job.company} ${job.description} ${job.skills.join(' ')}`.toLowerCase();
      return terms.some(term => text.includes(term));
    });
  }

  if (filters.location) jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
  if (filters.type) jobs = jobs.filter(job => job.type === filters.type);
  if (filters.remote !== undefined) jobs = jobs.filter(job => job.remote === filters.remote);
  if (filters.skills?.length) {
    jobs = jobs.filter(job => filters.skills.some(skill => job.skills.some(js => js.toLowerCase().includes(skill.toLowerCase()))));
  }

  return jobs;
};

// Recommended jobs
export const getRecommendedJobs = async (userSkills: string[], experience: string): Promise<Job[]> => {
  const allJobs = await searchJobs();
  return allJobs
    .filter(job => job.skills.some(skill => userSkills.some(us => skill.toLowerCase().includes(us.toLowerCase()))))
    .sort((a, b) => b.skills.filter(s => userSkills.includes(s)).length - a.skills.filter(s => userSkills.includes(s)).length)
    .slice(0, 20);
};

// Get job by ID
export const getJobById = async (id: string): Promise<Job | null> => {
  const allJobs = await searchJobs();
  return allJobs.find(job => job.id === id) || null;
};

// Analytics
let searchAnalytics = {
  totalSearches: 0,
  popularSkills: new Map<string, number>(),
  popularLocations: new Map<string, number>()
};

export const recordUserJobSearch = (title: string, location: string) => {
  searchAnalytics.totalSearches++;
  searchAnalytics.popularSkills.set(title, (searchAnalytics.popularSkills.get(title) || 0) + 1);
  searchAnalytics.popularLocations.set(location, (searchAnalytics.popularLocations.get(location) || 0) + 1);
};

export const getJobMarketAnalytics = () => ({
  totalJobs: 1000,
  totalSearches: searchAnalytics.totalSearches,
  topSkills: Array.from(searchAnalytics.popularSkills.entries()).sort((a,b) => b[1]-a[1]).slice(0,10),
  topLocations: Array.from(searchAnalytics.popularLocations.entries()).sort((a,b) => b[1]-a[1]).slice(0,10)
});
