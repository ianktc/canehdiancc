import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchJobById } from '../lib/supabase';
import type { Job } from '../data/jobs';

export default function JobPostingPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJob() {
      if (!id) {
        setError('Invalid job ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchJobById(id);
        
        if (!data) {
          setError('The job board is currently unavailable. Please try again later.');
          setJob(null);
        } else {
          setJob(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch job:', err);
        setError('The job board is currently unavailable. Please try again later.');
        setJob(null);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id]);

  if (loading) {
    return (
      <main className="job-posting-page">
        <div className="container">
          <div className="loading-state">Loading job details...</div>
        </div>
      </main>
    );
  }

  if (error && !job) {
    return (
      <main className="job-posting-page">
        <div className="container">
          <div className="error-state">
            <p>{error}</p>
            <Link to="/jobs" className="back-link">← Back to all jobs</Link>
          </div>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="job-posting-page">
        <div className="container">
          <div className="error-state">
            <p>Job not found</p>
            <Link to="/jobs" className="back-link">← Back to all jobs</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="job-posting-page">
      <div className="container">
        <Link to="/jobs" className="back-link">← Back to all jobs</Link>
        
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <article className="job-posting">
          <header className="job-header">
            <div>
              <h1>{job.title}</h1>
              <div className="company-info">
                <span className="company-name">{job.company}</span>
                <span className="separator">•</span>
                <span className="location">{job.location}</span>
                {job.remote && (
                  <>
                    <span className="separator">•</span>
                    <span className="remote-badge">Remote friendly</span>
                  </>
                )}
              </div>
            </div>
            {job.salary && (
              <div className="salary-badge">{job.salary}</div>
            )}
          </header>

          <div className="job-meta">
            {job.postedAt && (
              <span className="posted-date">Posted {job.postedAt} ago</span>
            )}
          </div>

          {job.tags && job.tags.length > 0 && (
            <div className="tags-section">
              <h3>Skills & Technologies</h3>
              <div className="tags">
                {job.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {job.description && (
            <div className="description-section">
              <h3>About the Role</h3>
              <div className="description">
                {job.description.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {!job.description && (
            <div className="description-section">
              <h3>About the Role</h3>
              <p className="muted">
                Job description not available. Please visit the company's website or 
                contact them directly for more information about this position.
              </p>
            </div>
          )}

          <div className="apply-section">
            {job.applyUrl ? (
              <a 
                href={job.applyUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="apply-btn-large"
              >
                Apply for this role →
              </a>
            ) : (
              <p className="muted">
                Application link not available. Please contact {job.company} directly.
              </p>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
