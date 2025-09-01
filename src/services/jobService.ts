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

// ✅ Alias so CareerPortal.tsx stops breaking
export { fetchJobsFromRapidAPIJobPostings as fetchJobsFromRapidAPI };
