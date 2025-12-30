import { Link } from 'react-router-dom';
import type { Job } from '../data/jobs';

type Props = {
  job: Job;
};

export default function JobCard({ job }: Props) {
  return (
    <article className="job-card" aria-labelledby={`job-${job.id}-title`}>
      <div className='header'>
        <div className='left'>
          <div className="title" id={`job-${job.id}-title`}>
            {job.title.length > 31 ? job.title.slice(0, 29) + '…' : job.title}
          </div>
          <div className="company">{job.company}</div>
        </div>
        <div className='right'>
          {job.logoUrl && (
            <img className="company-logo" src={job.logoUrl} alt={`${job.company} logo`} />
          )}    
        </div>
      </div>
      <div className="meta">
        <span>{job.location}</span>
        {job.salary && <span>• {job.salary}</span>}
      </div>
      <div className="tags">
        {job.tags.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      <Link to={`/jobs/${job.id}`} className="apply-btn" aria-label={`View ${job.title} at ${job.company}`}>
        View Details
      </Link>
    </article>
  );
}
