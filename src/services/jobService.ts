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
          'x-rapidapi-key': '03b3cf7493msh0a84fa633dc8487p10ae9djsn745e069e1ee4',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Map API response to Job[]
    return data.map((job: any) => ({
      id: job.id?.toString() || crypto.randomUUID(),
      title: job.title || 'No Title',
      company: job.company || 'Unknown',
      description: job.description || '',
      location: job.location || 'Not specified',
      type: job.type || 'N/A',
      remote: job.remote ?? false,
      skills: job.skills || [],
      source: 'rapidapi-jobpostings',
    }));
  } catch (error) {
    console.error('Error fetching jobs from RapidAPI job-postings:', error);
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
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=${numPages}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          'x-rapidapi-key': '03b3cf7493msh0a84fa633dc8487p10ae9djsn745e069e1ee4',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data) return [];

    // Map API response to Job[]
    return data.data.map((job: any) => ({
      id: job.job_id?.toString() || crypto.randomUUID(),
      title: job.job_title || 'No Title',
      company: job.employer_name || 'Unknown',
      description: job.job_description || '',
      location: job.job_location || 'Not specified',
      type: job.job_employment_type || 'N/A',
      remote: job.job_is_remote ?? false,
      skills: job.job_required_skills || [],
      source: 'rapidapi-jsearch',
    }));
  } catch (error) {
    console.error('Error fetching jobs from RapidAPI jsearch:', error);
    return [];
  }
};

// ------------------------------
// Combined function to fetch jobs from both sources
// ------------------------------
export const fetchAllJobs = async (
  query: string = 'developer',
  page: number = 1
): Promise<Job[]> => {
  try {
    const [jobsFromPostings, jobsFromJSearch] = await Promise.all([
      fetchJobsFromRapidAPIJobPostings(page, 12),
      fetchJobsFromRapidAPIJSearch(query, page, 1),
    ]);

    return [...jobsFromPostings, ...jobsFromJSearch];
  } catch (error) {
    console.error('Error fetching jobs from both sources:', error);
    return [];
  }
};
