// Database row type from Supabase
export type JobDescriptionRow = {
  id: string;
  overview: string;
  responsibilities: string;
  qualifications: string;
};

// Frontend display type
export type JobDescription = {
  id: string;
  overview?: string;
  responsibilities?: string;
  qualifications?: string;
};