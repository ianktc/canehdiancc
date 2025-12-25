import { createClient } from '@supabase/supabase-js';
import type { Job, JobRow } from '../data/jobs';

// Environment variables - set these in .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Transform database row to frontend Job type
 */
function mapJobRow(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    remote: row.remote,
    tags: row.tags,
    industry: row.industry || undefined,
    department: row.department || undefined,
    salary: row.salary || undefined,
    postedAt: row.posted_at || undefined,
    description: row.description || undefined,
    applyUrl: row.apply_url || undefined,
  };
}

/**
 * Fetch all jobs from Supabase
 */
export async function fetchJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return (data || []).map(mapJobRow);
}

/**
 * Fetch a single job by ID
 */
export async function fetchJobById(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return null;
  }

  return data ? mapJobRow(data) : null;
}

/**
 * Add a new job (requires auth/admin permissions in production)
 */
export async function addJob(job: Omit<JobRow, 'id' | 'created_at'>): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return data ? mapJobRow(data) : null;
}

/**
 * Update an existing job
 */
export async function updateJob(id: string, updates: Partial<JobRow>): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return data ? mapJobRow(data) : null;
}

/**
 * Delete a job
 */
export async function deleteJob(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase error:', error);
    return false;
  }

  return true;
}
