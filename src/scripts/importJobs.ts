import 'dotenv/config';
import { addJob, addJobDescription, supabase } from '../lib/supabase';
import { jobImport, JobDescriptionImport } from '../data/import';

async function importJobs() {
  // Sign in as a user
  const importUserEmail = process.env.IMPORT_USER_EMAIL;
  const importUserPassword = process.env.IMPORT_USER_PASSWORD;
  if (!importUserEmail || !importUserPassword) {
    throw new Error('IMPORT_USER_EMAIL and IMPORT_USER_PASSWORD must be set in environment variables.');
  }
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email: importUserEmail,
    password: importUserPassword,
  });
  if (error || !session) {
    console.error('Auth failed:', error);
    process.exit(1);
  }

  if(jobImport.length !== JobDescriptionImport.length) {
    console.error('Job import and description import lengths do not match.');
    process.exit(1);
  }

  // Now supabase client is authenticated, run your import logic
  for (let i = 0; i < jobImport.length; i++) {
    const job = jobImport[i];
    const jobDescription = JobDescriptionImport[i];
    const { id, created_at, posted_at, ...jobData } = job;
    try {
      const resultJobImport = await addJob(jobData);
      const resultJobDescriptionImport = await addJobDescription(jobDescription);

      if (resultJobImport && resultJobDescriptionImport) {
        console.log(`Imported job: ${resultJobImport.title}`);
      } else {
        console.warn(`Failed to import job: ${job.title}`);
      }
    } catch (err) {
      console.error(`Error importing job: ${job.title}`, err);
    }
  }
}

importJobs().then(() => {
  console.log(`Job import complete. Imported ${jobImport.length} jobs.`);
  process.exit(0);
});