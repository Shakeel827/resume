// src/services/jobService.ts

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  remote: boolean;
  skills: string[];
  source: 'rapidapi-jobpostings' | 'rapidapi-jsearch';
}

// ------------------------------
// Fetch jobs from job-postings1.p.rapidapi.com
// ------------------------------
export const fetchJobsFromRapidAPIJobPostings = async (
  page: number = 1,
  pageSize: number = 12
): Promise<Job[]> => {
  try {
    const response = await fetch(
      `https://job-postings1.p.rapidapi.com/?PageNumber=${page}&PageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '03b3cf7493msh0a84fa633dc8487p10ae9djsn745e069e1ee4',
          'X-RapidAPI-Host': 'job-postings1.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // ✅ If API returns object with "jobs" field
    const jobs = Array.isArray(data) ? data : data.jobs || [];

    return jobs.map((job: any) => ({
      id: job.id || job.job_id || Math.random().toString(),
      title: job.title || job.job_title || 'No title',
      company: job.company || job.employer || 'Unknown',
      description: job.description || job.job_description || '',
      location: job.location || job.city || '',
      type: job.type || job.job_type || '',
      remote: job.remote || false,
      skills: job.skills || [],
      source: 'rapidapi-jobpostings',
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

// ------------------------------
// Fetch jobs from jsearch.p.rapidapi.com
// ------------------------------
export const fetchJobsFromJSearch = async (query: string = 'developer jobs', page: number = 1, num_pages: number = 1): Promise<Job[]> => {
  try {
    const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=${num_pages}&country=us&date_posted=all`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        'x-rapidapi-key': '03b3cf7493msh0a84fa633dc8487p10ae9djsn745e069e1ee4'
      }
    });

    const data = await response.json();

    return (data.data || []).map((job: any) => ({
      id: job.job_id || job.id || Math.random().toString(),
      title: job.job_title || '',
      company: job.employer_name || '',
      description: job.job_description || '',
      location: job.job_city || '',
      type: job.job_employment_type || '',
      remote: job.job_is_remote || false,
      skills: job.job_required_skills || [],
      source: 'rapidapi-jsearch'
    }));
  } catch (error) {
    console.error('Error fetching jobs from jsearch RapidAPI:', error);
    return [];
  }
};

// ------------------------------
// Smart job fetching (combine multiple sources)
// ------------------------------
export const fetchSmartJobsFromInternet = async (): Promise<Job[]> => {
  const jobs1 = await fetchJobsFromRapidAPIJobPostings();
  const jobs2 = await fetchJobsFromJSearch();
  return [...jobs1, ...jobs2]; // Combine and return
};

// ------------------------------
// Search & filter jobs
// ------------------------------
export const searchJobs = async (query: string, filters: any = {}): Promise<Job[]> => {
  const convertedJobs = await fetchSmartJobsFromInternet();
  let filteredJobs = convertedJobs;

  if (query) {
    const searchTerms = query.toLowerCase().split(' ');
    filteredJobs = filteredJobs.filter(job => {
      const searchText = `${job.title} ${job.company} ${job.description} ${job.skills.join(' ')}`.toLowerCase();
      return searchTerms.some(term => searchText.includes(term));
    });
  }

  if (filters.location) {
    filteredJobs = filteredJobs.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
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

// ------------------------------
// Get recommended jobs by skills
// ------------------------------
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

// ------------------------------
// Get job by ID
// ------------------------------
export const getJobById = async (id: string): Promise<Job | null> => {
  const allJobs = await searchJobs('', {});
  return allJobs.find(job => job.id === id) || null;
};

// ------------------------------
// Analytics & tracking
// ------------------------------
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

// ------------------------------
// Utility: calculate time ago
// ------------------------------
export const calculateTimeAgo = (dateString: string): string => {
  const now = new Date();
  const posted = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
};
