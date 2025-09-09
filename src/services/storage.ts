import { Job } from '../types/job';

const STORAGE_KEY = 'career_jobs';
const ADMIN_SESSION_KEY = 'admin_session';
const API_LAST_SYNC_KEY = 'api_last_sync';

export class JobStorageService {
  // Get all jobs from localStorage
  static getAllJobs(): Job[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading jobs from storage:', error);
      return [];
    }
  }

  // Save jobs to localStorage
  static saveJobs(jobs: Job[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
      localStorage.setItem(API_LAST_SYNC_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Error saving jobs to storage:', error);
    }
  }

  // Get active jobs only (for public career page)
  static getActiveJobs(): Job[] {
    return this.getAllJobs().filter(job => job.isActive);
  }

  // Add a new job
  static addJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job {
    const jobs = this.getAllJobs();
    const newJob: Job = {
      ...jobData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    jobs.push(newJob);
    this.saveJobs(jobs);
    return newJob;
  }

  // Update an existing job
  static updateJob(id: string, updates: Partial<Job>): Job | null {
    const jobs = this.getAllJobs();
    const index = jobs.findIndex(job => job.id === id);
    
    if (index === -1) return null;
    
    jobs[index] = {
      ...jobs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveJobs(jobs);
    return jobs[index];
  }

  // Delete a job
  static deleteJob(id: string): boolean {
    const jobs = this.getAllJobs();
    const filteredJobs = jobs.filter(job => job.id !== id);
    
    if (filteredJobs.length === jobs.length) return false;
    
    this.saveJobs(filteredJobs);
    return true;
  }

  // Delete multiple jobs
  static deleteJobs(ids: string[]): number {
    const jobs = this.getAllJobs();
    const filteredJobs = jobs.filter(job => !ids.includes(job.id));
    const deletedCount = jobs.length - filteredJobs.length;
    
    this.saveJobs(filteredJobs);
    return deletedCount;
  }

  // Delete all jobs
  static deleteAllJobs(): number {
    const jobs = this.getAllJobs();
    const count = jobs.length;
    this.saveJobs([]);
    return count;
  }

  // Get job by ID
  static getJobById(id: string): Job | null {
    const jobs = this.getAllJobs();
    return jobs.find(job => job.id === id) || null;
  }

  // Search and filter jobs
  static searchJobs(filters: {
    search?: string;
    location?: string;
    jobType?: string;
    company?: string;
    activeOnly?: boolean;
  }): Job[] {
    let jobs = filters.activeOnly ? this.getActiveJobs() : this.getAllJobs();

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        (job.requirements && job.requirements.some(req => 
          req.toLowerCase().includes(searchTerm)
        ))
      );
    }

    if (filters.location) {
      jobs = jobs.filter(job => 
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.jobType) {
      jobs = jobs.filter(job => job.jobType === filters.jobType);
    }

    if (filters.company) {
      jobs = jobs.filter(job => 
        job.company.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    return jobs;
  }

  // Admin session management
  static setAdminSession(): void {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
  }

  static isAdminLoggedIn(): boolean {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  }

  static clearAdminSession(): void {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }

  // Sync with API
  static async syncWithAPI(): Promise<boolean> {
    try {
      // Try to fetch from your existing job service
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('API not available');
      
      const apiJobs = await response.json();
      
      // Convert API jobs to our Job interface format
      const formattedJobs: Job[] = apiJobs.map((apiJob: any) => ({
        id: apiJob.id || this.generateId(),
        title: apiJob.title || apiJob.job_title || 'Untitled Position',
        company: apiJob.company || apiJob.employer_name || 'Unknown Company',
        description: apiJob.description || apiJob.job_description || 'No description available',
        location: apiJob.location || apiJob.job_city || 'Location not specified',
        jobType: this.normalizeJobType(apiJob.type || apiJob.job_employment_type || 'full-time'),
        applicationLink: apiJob.applicationLink || apiJob.job_apply_link || '#',
        salary: apiJob.salary || apiJob.estimated_salary || '',
        requirements: apiJob.requirements || apiJob.job_required_skills || [],
        postedDate: apiJob.postedDate || apiJob.job_posted_at_datetime_utc || new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      // Merge with existing jobs (keep local additions/edits)
      const existingJobs = this.getAllJobs();
      const mergedJobs = this.mergeJobs(existingJobs, formattedJobs);
      
      this.saveJobs(mergedJobs);
      return true;
    } catch (error) {
      console.error('API sync failed:', error);
      return false;
    }
  }

  // Merge API jobs with local jobs, preserving local changes
  private static mergeJobs(localJobs: Job[], apiJobs: Job[]): Job[] {
    const merged = [...localJobs];
    
    apiJobs.forEach(apiJob => {
      const existingIndex = merged.findIndex(job => 
        job.title === apiJob.title && job.company === apiJob.company
      );
      
      if (existingIndex === -1) {
        // New job from API
        merged.push(apiJob);
      } else {
        // Update existing job with API data, but preserve local modifications
        const existing = merged[existingIndex];
        merged[existingIndex] = {
          ...apiJob,
          id: existing.id,
          isActive: existing.isActive,
          createdAt: existing.createdAt,
          updatedAt: existing.updatedAt
        };
      }
    });
    
    return merged;
  }

  private static normalizeJobType(type: string): Job['jobType'] {
    const normalized = type.toLowerCase().replace(/[_-]/g, '');
    
    if (normalized.includes('fulltime') || normalized.includes('full')) return 'full-time';
    if (normalized.includes('parttime') || normalized.includes('part')) return 'part-time';
    if (normalized.includes('contract') || normalized.includes('contractor')) return 'contract';
    if (normalized.includes('intern')) return 'internship';
    if (normalized.includes('remote')) return 'remote';
    
    return 'full-time';
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get storage statistics
  static getStorageStats() {
    const jobs = this.getAllJobs();
    const lastSync = localStorage.getItem(API_LAST_SYNC_KEY);
    
    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(j => j.isActive).length,
      inactiveJobs: jobs.filter(j => !j.isActive).length,
      lastSync: lastSync ? new Date(lastSync) : null,
      storageSize: new Blob([JSON.stringify(jobs)]).size
    };
  }

  // Initialize with sample data if storage is empty
  static initializeSampleData(): void {
    const existingJobs = this.getAllJobs();
    if (existingJobs.length > 0) return;

    const sampleJobs: Job[] = [
      {
        id: this.generateId(),
        title: 'Senior Frontend Developer',
        company: 'TechCorp India',
        description: 'Join our team to build amazing user experiences with React and TypeScript. Work on cutting-edge projects that impact millions of users.',
        location: 'Bangalore, Karnataka',
        jobType: 'full-time',
        applicationLink: 'https://techcorp.com/careers',
        salary: '₹15-25 LPA',
        requirements: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
        postedDate: new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: this.generateId(),
        title: 'Data Scientist',
        company: 'Analytics Pro',
        description: 'Use machine learning and data analysis to drive business insights. Work with large datasets and build predictive models.',
        location: 'Mumbai, Maharashtra',
        jobType: 'full-time',
        applicationLink: 'https://analyticspro.com/jobs',
        salary: '₹12-20 LPA',
        requirements: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow'],
        postedDate: new Date(Date.now() - 86400000).toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: this.generateId(),
        title: 'Product Manager',
        company: 'StartupXYZ',
        description: 'Lead product strategy and execution for our growing SaaS platform. Work closely with engineering and design teams.',
        location: 'Delhi, NCR',
        jobType: 'full-time',
        applicationLink: 'https://startupxyz.com/careers',
        salary: '₹18-30 LPA',
        requirements: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
        postedDate: new Date(Date.now() - 172800000).toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.saveJobs(sampleJobs);
  }
}
