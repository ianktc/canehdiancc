import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';
import { jobs as mockJobs } from '../data/jobs';
import { fetchJobs } from '../lib/supabase';
import type { Job } from '../data/jobs';

export default function JobGrid() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const data = await fetchJobs();
        if (data.length > 0) {
          setJobs(data);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Failed to load jobs. Showing sample data.');
        // Keep mock data on error
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  return (
    <section id="jobs" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Latest Roles</h2>
          <span className="muted">
            {loading ? 'Loading...' : `${jobs.length} jobs`}
          </span>
        </div>
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
