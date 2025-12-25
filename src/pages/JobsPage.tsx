import { useEffect, useMemo, useState } from 'react';
import JobCard from '../components/JobCard';
import { fetchCurrentJobs } from '../lib/supabase';
import type { Job } from '../data/jobs';
import SearchableSelect from '../components/SearchableSelect';

// Removed salary filter; using industry and department instead

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

//

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [industry, setIndustry] = useState<string[]>([]);
  const [department, setDepartment] = useState<string[]>([]);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const data = await fetchCurrentJobs();
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

  const provinceOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    const termsMap: Record<string, Set<string>> = {};

    jobs.forEach((job) => {
      const loc = job.location || '';
      const city = loc.split(',')[0].trim();
      Object.keys(PROVINCE_MAP).forEach((code) => {
        if (loc.includes(code)) {
          counts[code] = (counts[code] || 0) + 1;
          if (!termsMap[code]) termsMap[code] = new Set<string>();
          termsMap[code].add(loc);
          if (city) termsMap[code].add(city);
        }
      });
    });

    const sortedCodes = Object.keys(PROVINCE_MAP).sort((a, b) => (counts[b] || 0) - (counts[a] || 0));
    return [
      { code: '', label: 'All locations' },
      ...sortedCodes.map((code) => ({
        code,
        label: `${PROVINCE_MAP[code]}${counts[code] ? ` (${counts[code]})` : ''}`,
        terms: Array.from(termsMap[code] || new Set<string>()),
      })),
    ];
  }, [jobs]);

  const industryOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((job) => {
      const list = Array.isArray(job.industry)
        ? job.industry
        : job.industry
        ? [job.industry]
        : [];
      list.forEach((name) => {
        const key = (name || '').trim();
        if (!key) return;
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return sorted.map((name) => ({ code: name, label: `${name} (${counts[name]})` }));
  }, [jobs]);

  const departmentOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((job) => {
      const list = Array.isArray(job.department)
        ? job.department
        : job.department
        ? [job.department]
        : [];
      list.forEach((name) => {
        const key = (name || '').trim();
        if (!key) return;
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return sorted.map((name) => ({ code: name, label: `${name} (${counts[name]})` }));
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesTitle = q === '' || job.title.toLowerCase().includes(q);
      const matchesLocation = location === '' || job.location.includes(location);
      const matchesRemote = !remoteOnly || job.remote;
      const matchesIndustry =
        industry.length === 0 ||
        (Array.isArray(job.industry)
          ? job.industry.some((i) => industry.includes((i || '').toLowerCase()))
          : industry.includes(((job.industry || '') as string).toLowerCase()));
      const matchesDepartment =
        department.length === 0 ||
        (Array.isArray(job.department)
          ? job.department.some((d) => department.includes((d || '').toLowerCase()))
          : department.includes(((job.department || '') as string).toLowerCase()));
      return matchesTitle && matchesLocation && matchesRemote && matchesIndustry && matchesDepartment;
    });
  }, [jobs, query, location, remoteOnly, industry, department]);

  const handleReset = () => {
    setQuery('');
    setLocation('');
    setRemoteOnly(false);
    setIndustry([]);
    setDepartment([]);
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
              <SearchableSelect
                options={provinceOptions}
                value={location}
                onChange={(val) => setLocation(Array.isArray(val) ? val[0] || '' : val)}
                ariaLabel="Location filter"
                placeholder="All locations"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="industry">Industry</label>
              <SearchableSelect
                options={industryOptions}
                value={industry}
                onChange={(val) => setIndustry(Array.isArray(val) ? val : [])}
                ariaLabel="Industry filter"
                placeholder="All industries"
                multiple
              />
            </div>

            <div className="filter-group">
              <label htmlFor="department">Department</label>
              <SearchableSelect
                options={departmentOptions}
                value={department}
                onChange={(val) => setDepartment(Array.isArray(val) ? val : [])}
                ariaLabel="Department filter"
                placeholder="All departments"
                multiple
              />
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
