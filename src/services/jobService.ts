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
  source: "rapidapi-jobpostings" | "rapidapi-jsearch";
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
          "x-rapidapi-key": "YOUR_RAPIDAPI_KEY", // replace with your key
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Ensure data is an array
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((job: any) => ({
      id: String(job.id ?? crypto.randomUUID()),
      title: job.title ?? "Untitled",
      company: job.company ?? "Unknown",
      description: job.description ?? "No description provided",
      location: job.location ?? "Not specified",
      type: job.type ?? "N/A",
      remote: job.remote ?? false,
      skills: Array.isArray(job.skills) ? job.skills : [],
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
  query: string = "developer",
  page: number = 1,
  numPages: number = 1
): Promise<Job[]> => {
  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
        query
      )}&page=${page}&num_pages=${numPages}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
          "x-rapidapi-key": "YOUR_RAPIDAPI_KEY", // replace with your key
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((job: any) => ({
      id: String(job.job_id ?? crypto.randomUUID()),
      title: job.job_title ?? "Untitled",
      company: job.employer_name ?? "Unknown",
      description: job.job_description ?? "No description provided",
      location: job.job_city
        ? `${job.job_city}, ${job.job_country}`
        : "Not specified",
      type: job.job_employment_type ?? "N/A",
      remote: job.job_is_remote ?? false,
      skills: job.job_required_skills ?? [],
      source: "rapidapi-jsearch",
    }));
  } catch (error) {
    console.error("Error fetching jobs from RapidAPI JSearch:", error);
    return [];
  }
};

// ------------------------------
// Combine results from multiple APIs
// ------------------------------
export const fetchAllJobs = async (): Promise<Job[]> => {
  try {
    const [jobsFromPostings, jobsFromJSearch] = await Promise.all([
      fetchJobsFromRapidAPIJobPostings(1, 10),
      fetchJobsFromRapidAPIJSearch("software engineer", 1, 1),
    ]);

    return [...jobsFromPostings, ...jobsFromJSearch];
  } catch (error) {
    console.error("Error fetching jobs from multiple APIs:", error);
    return [];
  }
};
