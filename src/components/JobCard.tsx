import type { Job } from '../data/jobs';

type Props = {
  job: Job;
};

export default function JobCard({ job }: Props) {
  return (
    <article className="job-card" aria-labelledby={`job-${job.id}-title`}>
      <div className="title" id={`job-${job.id}-title`}>{job.title}</div>
      <div className="company">{job.company}</div>
      <div className="meta">
        <span>{job.location}</span>
        {job.remote && <span>• Remote friendly</span>}
        {job.salary && <span>• {job.salary}</span>}
      </div>
      <div className="tags">
        {job.tags.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      <a className="apply-btn" href="#" aria-label={`Apply to ${job.title} at ${job.company}`}>Apply</a>
    </article>
  );
}
