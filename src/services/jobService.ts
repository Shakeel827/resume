// src/services/jobService.ts
import fetch from "node-fetch";

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  remote: boolean;
  skills: string[];
  source: "deepseek";
}

// ----------------------
// DeepSeek API key
// ----------------------
const OPENROUTER_API_KEY = "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";

// ----------------------
// Fetch jobs from DeepSeek
// ----------------------
export const fetchJobsFromDeepSeek = async (
  query: string = "",
  page: number = 1,
  pageSize: number = 12
): Promise<Job[]> => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          {
            role: "user",
            content: `Fetch ${pageSize} job postings for query: "${query}" on page ${page}. 
                      Return as JSON array with keys: id, title, company, description, location, type, remote, skills.`
          }
        ],
        extra_headers: {
          "HTTP-Referer": "https://your-site.com",
          "X-Title": "Smart Resume Builder"
        },
        extra_body: {}
      })
    });

    const data = await response.json();

    if (!data.choices || !Array.isArray(data.choices)) {
      console.error("Unexpected DeepSeek API response:", data);
      return [];
    }

    const content = data.choices[0].message.content;
    let jobs: Job[] = [];
    try {
      jobs = JSON.parse(content);
    } catch (err) {
      console.error("Failed to parse DeepSeek JSON:", content, err);
    }

    return jobs.map(job => ({ ...job, source: "deepseek" }));
  } catch (err) {
    console.error("Error fetching jobs from DeepSeek:", err);
    return [];
  }
};

// ----------------------
// Get recommended jobs
// ----------------------
export const getRecommendedJobs = async (userSkills: string[], experience: string): Promise<Job[]> => {
  const allJobs = await fetchJobsFromDeepSeek();

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

// ----------------------
// Get job by ID
// ----------------------
export const getJobById = async (id: string): Promise<Job | null> => {
  const allJobs = await fetchJobsFromDeepSeek();
  return allJobs.find(job => job.id === id) || null;
};

// ----------------------
// Analytics and tracking
// ----------------------
let searchAnalytics = {
  totalSearches: 0,
  popularSkills: new Map<string, number>(),
  popularLocations: new Map<string, number>()
};

export function recordUserJobSearch(title: string, location: string) {
  searchAnalytics.totalSearches++;
  searchAnalytics.popularSkills.set(title, (searchAnalytics.popularSkills.get(title) || 0) + 1);
  searchAnalytics.popularLocations.set(location, (searchAnalytics.popularLocations.get(location) || 0) + 1);
}

export const getJobMarketAnalytics = () => {
  return {
    totalJobs: 1000,
    totalSearches: searchAnalytics.totalSearches,
    topSkills: Array.from(searchAnalytics.popularSkills.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
    topLocations: Array.from(searchAnalytics.popularLocations.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  };
};
