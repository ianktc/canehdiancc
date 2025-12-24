import { useEffect, useMemo, useState } from 'react';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../lib/supabase';
import type { Job } from '../data/jobs';

const SALARY_OPTIONS = [
  { label: 'Any salary', value: 0 },
  { label: '$100k+', value: 100 },
  { label: '$130k+', value: 130 },
  { label: '$150k+', value: 150 },
  { label: '$170k+', value: 170 },
];

const PROVINCE_MAP: Record<string, string> = {
  YT: 'Yukon',
  NU: 'Nunavut',
  NT: 'Northwest Territories',
  BC: 'British Columbia',
  AB: 'Alberta',
  SK: 'Saskatchewan',
  MB: 'Manitoba',
  ON: 'Ontario',
  QC: 'Quebec',
  NL: 'Newfoundland & Labrador',
  NB: 'New Brunswick',
  PE: 'PEI',
  NS: 'Nova Scotia',
};

function extractMinSalary(salary?: string): number {
  if (!salary) return 0;
  const match = salary.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [salaryMin, setSalaryMin] = useState<number>(0);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const data = await fetchJobs();
        if (data.length > 0) setJobs(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Unable to load jobs right now. Showing sample roles.');
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const loc = location.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesTitle = q === '' || job.title.toLowerCase().includes(q);
      const matchesLocation = loc === '' || job.location.toLowerCase().includes(loc);
      const matchesRemote = !remoteOnly || job.remote;
      const matchesSalary = salaryMin === 0 || extractMinSalary(job.salary) >= salaryMin;
      return matchesTitle && matchesLocation && matchesRemote && matchesSalary;
    });
  }, [jobs, query, location, remoteOnly, salaryMin]);

  const handleReset = () => {
    setQuery('');
    setLocation('');
    setRemoteOnly(false);
    setSalaryMin(0);
  };

  return (
    <main className="jobs-page">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h1>Browse Jobs</h1>
              <p className="muted">Search civic tech, GIS, policy, and urban planning roles.</p>
            </div>
            <span className="muted">{loading ? 'Loading…' : `${filtered.length} roles`}</span>
          </div>

          <div className="filters">
            <div className="filter-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Search by title"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="City, province, or remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="salary">Salary</label>
              <select
                id="salary"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
              >
                {SALARY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group filter-checkbox">
              <label htmlFor="remote" className="checkbox-label">
                <input
                  id="remote"
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                />
                Remote only
              </label>
              <button className="ghost-btn" onClick={handleReset} type="button">
                Reset
              </button>
            </div>
          </div>

          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          <div className="jobs-grid">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
