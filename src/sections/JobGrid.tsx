import JobCard from '../components/JobCard';
import { jobs } from '../data/jobs';

export default function JobGrid() {
  return (
    <section id="jobs" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Latest Roles</h2>
          <span className="muted">{jobs.length} jobs</span>
        </div>
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
