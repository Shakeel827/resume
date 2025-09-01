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

  // Map API response to your Job interface
  const jobs: Job[] = data.map((job: any) => ({
    id: job.id || job.JobID || Math.random().toString(36).substring(2),
    title: job.title || job.JobTitle || 'Unknown Title',
    company: job.company || job.CompanyName || 'Unknown Company',
    description: job.description || job.JobDescription || '',
    location: job.location || job.Location || 'Unknown Location',
    type: job.type?.toLowerCase() as 'full-time' | 'part-time' | 'internship' || 'full-time',
    remote: job.remote ?? false,
    skills: job.skills || [],
    source: 'rapidapi'
  }));

  return jobs;
};

// Search jobs with filters
export const searchJobs = async (query: string, filters: any = {}): Promise<Job[]> => {
  const allJobs = await fetchJobsFromRapidAPI();
  let filteredJobs = allJobs;

  if (query) {
    const searchTerms = query.toLowerCase().split(' ');
    filteredJobs = filteredJobs.filter(job => {
      const searchText = `${job.title} ${job.company} ${job.description} ${job.skills.join(' ')}`.toLowerCase();
      return searchTerms.some(term => searchText.includes(term));
    });
  }

  if (filters.location) {
    filteredJobs = filteredJobs.filter(job =>
      job.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.type) {
    filteredJobs = filteredJobs.filter(job => job.type === filters.type);
  }

  if (filters.remote !== undefined) {
    filteredJobs = filteredJobs.filter(job => job.remote === filters.remote);
  }

  if (filters.skills && filters.skills.length > 0) {
    filteredJobs = filteredJobs.filter(job =>
      filters.skills.some(skill =>
        job.skills.some(jobSkill => jobSkill.toLowerCase().includes(skill.toLowerCase()))
      )
    );
  }

  return filteredJobs;
};

// Recommended jobs based on skills
export const getRecommendedJobs = async (userSkills: string[], experience: string): Promise<Job[]> => {
  const allJobs = await searchJobs('', {});
  return allJobs
    .filter(job =>
      job.skills.some(skill =>
        userSkills.some(userSkill =>
          skill.toLowerCase().includes(userSkill.toLowerCase()) ||
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    )
    .sort((a, b) => {
      const aMatches = a.skills.filter(skill =>
        userSkills.some(userSkill => skill.toLowerCase().includes(userSkill.toLowerCase()))
      ).length;
      const bMatches = b.skills.filter(skill =>
        userSkills.some(userSkill => skill.toLowerCase().includes(userSkill.toLowerCase()))
      ).length;
      return bMatches - aMatches;
    })
    .slice(0, 20);
};

// Get job by ID
export const getJobById = async (id: string): Promise<Job | null> => {
  const allJobs = await searchJobs('', {});
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
  topSkills: Array.from(searchAnalytics.popularSkills.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10),
  topLocations: Array.from(searchAnalytics.popularLocations.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10)
});

// Helper: calculate time ago
export const calculateTimeAgo = (dateString: string): string => {
  const now = new Date();
  const posted = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};
