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
          'x-rapidapi-host': 'job-postings1.p.rapidapi.com',
          'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY_HERE',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return (data || []).map((job: any) => ({
      id: job.id || `${job.title}-${Math.random()}`,
      title: job.title || 'Untitled Job',
      company: job.company || 'Unknown Company',
      description: job.description || 'No description available',
      location: job.location || 'Not specified',
      type: job.type || 'N/A',
      remote: job.remote || false,
      skills: job.skills || [],
      source: 'rapidapi-jobpostings',
    }));
  } catch (error) {
    console.error('Error fetching jobs from RapidAPI Job Postings:', error);
    return [];
  }
};

// ------------------------------
// Fetch jobs from jsearch.p.rapidapi.com
// ------------------------------
export const fetchJobsFromRapidAPIJSearch = async (
  query: string = 'developer',
  page: number = 1,
  numPages: number = 1
): Promise<Job[]> => {
  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}&num_pages=${numPages}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY_HERE',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return (data.data || []).map((job: any) => ({
      id: job.job_id || `${job.job_title}-${Math.random()}`,
      title: job.job_title || 'Untitled Job',
      company: job.employer_name || 'Unknown Company',
      description: job.job_description || 'No description available',
      location: job.job_location || 'Not specified',
      type: job.job_employment_type || 'N/A',
      remote: job.remote || false,
      skills: job.job_required_skills || [],
      source: 'rapidapi-jsearch',
    }));
  } catch (error) {
    console.error('Error fetching jobs from RapidAPI JSearch:', error);
    return [];
  }
};

// ------------------------------
// Fetch jobs from both APIs
// ------------------------------
export const fetchAllJobs = async (): Promise<Job[]> => {
  const [jobsFromPostings, jobsFromJSearch] = await Promise.all([
    fetchJobsFromRapidAPIJobPostings(),
    fetchJobsFromRapidAPIJSearch(),
  ]);

  return [...jobsFromPostings, ...jobsFromJSearch];
};
