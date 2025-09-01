export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship';
  remote: boolean;
  skills: string[];
  source: 'rapidapi' | 'manual';
}

// Mock function: replace with real API call if needed
export const searchJobs = async (query: string, filters: any): Promise<Job[]> => {
  let convertedJobs: Job[] = []; // Fetch or load jobs here
  let filteredJobs = convertedJobs;

  // Search by query
  if (query) {
    const searchTerms = query.toLowerCase().split(' ');
    filteredJobs = filteredJobs.filter(job => {
      const searchText = `${job.title} ${job.company} ${job.description} ${job.skills.join(' ')}`.toLowerCase();
      return searchTerms.some(term => searchText.includes(term));
    });
  }

  // Filter by location
  if (filters.location) {
    filteredJobs = filteredJobs.filter(job =>
      job.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  // Filter by type
  if (filters.type) {
    filteredJobs = filteredJobs.filter(job => job.type === filters.type);
  }

  // Filter by remote
  if (filters.remote !== undefined) {
    filteredJobs = filteredJobs.filter(job => job.remote === filters.remote);
  }

  // Filter by skills
  if (filters.skills && filters.skills.length > 0) {
    filteredJobs = filteredJobs.filter(job =>
      filters.skills.some(skill =>
        job.skills.some(jobSkill =>
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    );
  }

  return filteredJobs;
};

// Calculate how long ago job was posted
export const calculateTimeAgo = (dateString: string): string => {
  const now = new Date();
  const posted = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
};

// Get recommended jobs based on skills
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

// Get a job by ID
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

export const getJobMarketAnalytics = () => {
  return {
    totalJobs: 1000,
    totalSearches: searchAnalytics.totalSearches,
    topSkills: Array.from(searchAnalytics.popularSkills.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10),
    topLocations: Array.from(searchAnalytics.popularLocations.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10)
  };
};

// Smart job fetching (single export, no duplicates)
export const fetchSmartJobsFromInternet = async (): Promise<Job[]> => {
  console.log('Fetching smart jobs from internet...');
  // Add real fetching logic here (API call, scraping, etc.)
  return [];
};
