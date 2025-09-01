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

// Search jobs with filters
export const searchJobs = async (query: string, filters: any = {}): Promise<Job[]> => {
  const convertedJobs: Job[] = []; // Replace with local jobs if needed
  let filteredJobs = convertedJobs;

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

// Recommended jobs
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

// Smart job fetching
export const fetchSmartJobsFromInternet = async (): Promise<Job[]> => {
  console.log('Fetching smart jobs from internet...');
  return []; // Add scraping or AI logic here
};

// RapidAPI job fetching
export const fetchJobsFromRapidAPI = async (): Promise<Job[]> => {
  const response = await fetch('https://example-rapidapi.com/jobs', {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '03b3cf7493msh0a84fa633dc8487p10ae9djsn745e069e1ee4',
      'X-RapidAPI-Host': 'example-rapidapi.com'
    }
  });

  const data = await response.json();
  return data.jobs || []; // Adjust based on API response structure
};

// Helper: time ago
export const calculateTimeAgo = (dateString: string): string => {
  const now = new Date();
  const posted = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};
