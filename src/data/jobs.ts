// Database row type from Supabase
export type JobRow = {
  id: string;
  created_at: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  tags: string[]; 
  industry: string[] | null;
  department: string[] | null;
  salary: string | null;
  description: string | null;
  apply_url: string | null;
  posted_at: string | null;
};

// Frontend display type
export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  remote?: boolean;
  tags: string[];
  industry?: string[];
  department?: string[];
  salary?: string;
  postedAt?: string;
  description?: string;
  applyUrl?: string;
};

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'Polar Labs',
    location: 'Toronto, ON',
    remote: true,
    tags: ['React', 'TypeScript', 'Vite'],
    salary: '$140k–$170k CAD',
    postedAt: '2d',
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Maple Studio',
    location: 'Vancouver, BC',
    tags: ['Figma', 'Design Systems', 'UX'],
    salary: '$95k–$120k CAD',
    postedAt: '3d',
  },
  {
    id: '3',
    title: 'Data Engineer',
    company: 'Aurora Analytics',
    location: 'Remote (Canada)',
    remote: true,
    tags: ['Python', 'ETL', 'SQL'],
    salary: '$120k–$150k CAD',
    postedAt: '5d',
  },
  {
    id: '4',
    title: 'iOS Developer',
    company: 'North Star',
    location: 'Calgary, AB',
    tags: ['Swift', 'UIKit', 'Combine'],
    salary: '$115k–$135k CAD',
    postedAt: '6d',
  },
  {
    id: '5',
    title: 'Backend Engineer',
    company: 'Red Leaf',
    location: 'Montreal, QC',
    remote: true,
    tags: ['Node.js', 'PostgreSQL', 'GraphQL'],
    salary: '$130k–$155k CAD',
    postedAt: '1w',
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'Snowline',
    location: 'Ottawa, ON',
    tags: ['AWS', 'Terraform', 'Kubernetes'],
    salary: '$135k–$165k CAD',
    postedAt: '1w',
  },
  {
    id: '7',
    title: 'Fullstack Engineer',
    company: 'Prairie Tech',
    location: 'Winnipeg, MB',
    remote: true,
    tags: ['React', 'Node', 'TypeScript'],
    salary: '$125k–$150k CAD',
    postedAt: '1w',
  },
  {
    id: '8',
    title: 'Machine Learning Engineer',
    company: 'Borealis AI',
    location: 'Toronto, ON',
    tags: ['PyTorch', 'MLOps', 'NLP'],
    salary: '$150k–$190k CAD',
    postedAt: '1w',
  },
  {
    id: '9',
    title: 'Frontend Developer',
    company: 'Harbor',
    location: 'Halifax, NS',
    tags: ['React', 'CSS', 'Accessibility'],
    salary: '$95k–$115k CAD',
    postedAt: '9d',
  },
  {
    id: '10',
    title: 'Platform Engineer',
    company: 'Tundra Systems',
    location: 'Remote (Canada)',
    remote: true,
    tags: ['Go', 'gRPC', 'K8s'],
    salary: '$140k–$180k CAD',
    postedAt: '2w',
  },
  {
    id: '11',
    title: 'QA Automation Engineer',
    company: 'Skyline',
    location: 'Edmonton, AB',
    tags: ['Cypress', 'Playwright', 'CI/CD'],
    salary: '$95k–$120k CAD',
    postedAt: '2w',
  },
  {
    id: '12',
    title: 'Solutions Architect',
    company: 'Northern Lights',
    location: 'Remote (Canada)',
    remote: true,
    tags: ['AWS', 'Microservices', 'Security'],
    salary: '$160k–$210k CAD',
    postedAt: '3w',
  },
];
