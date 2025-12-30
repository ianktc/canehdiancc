import 'dotenv/config';
import { addJob } from '../lib/supabase';
import { jobImport } from '../data/import';

async function importJobs() {
  for (const job of jobImport) {
    // Remove id and created_at for addJob
    const { id, created_at, posted_at, ...jobData } = job;
    try {
      const result = await addJob(jobData);
      if (result) {
        console.log(`Imported job: ${result.title}`);
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