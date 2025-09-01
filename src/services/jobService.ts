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
        method: "GET",
        headers: {
          "x-rapidapi-host": "job-postings1.p.rapidapi.com",
          "x-rapidapi-key": "03b3cf7493msh0a84fa633dc8487p10ae9djsn745e069e1ee4", // 🔑 replace with your key
        },
      }
    );

    const data = await response.json();

    return (data || []).map((job: any) => ({
      id: job.id || crypto.randomUUID(),
      title: job.title || "Untitled",
      company: job.company || "Unknown",
      description: job.description || "No description available",
      location: job.location || "Not specified",
      type: job.type || "N/A",
      remote: job.remote || false,
      skills: job.skills || [],
      source: "rapidapi-jobpostings",
    }));
  } catch (error) {
    console.error("Error fetching jobs from RapidAPI JobPostings:", error);
    return [];
  }
};

// ------------------------------
// Fetch jobs from jsearch.p.rapidapi.com
// ------------------------------
export const fetchJobsFromRapidAPIJSearch = async (
  query: string = "software engineer",
  page: number = 1,
  num_pages: number = 1
): Promise<Job[]> => {
  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=${num_pages}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
          "x-rapidapi-key": "03b3cf7493msh0a84fa633dc8487p10ae9djsn745e069e1ee4", // 🔑 replace with your key
        },
      }
    );

    const data = await response.json();

    return (data.data || []).map((job: any) => ({
      id: job.job_id || crypto.randomUUID(),
      title: job.job_title || "Untitled",
      company: job.employer_name || "Unknown",
      description: job.job_description || "No description available",
      location: job.job_location || "Not specified",
      type: job.job_employment_type || "N/A",
      remote: job.remote || false,
      skills: job.job_required_skills || [],
      source: "rapidapi-jsearch",
    }));
  } catch (error) {
    console.error("Error fetching jobs from RapidAPI JSearch:", error);
    return [];
  }
};

// ------------------------------
// Combine both APIs as searchJobs
// ------------------------------
export const searchJobs = async (): Promise<Job[]> => {
  const [jobsFromPostings, jobsFromJSearch] = await Promise.all([
    fetchJobsFromRapidAPIJobPostings(),
    fetchJobsFromRapidAPIJSearch(),
  ]);
  return [...jobsFromPostings, ...jobsFromJSearch];
};

// Export helpers if needed separately
export { fetchJobsFromRapidAPIJobPostings, fetchJobsFromRapidAPIJSearch };
