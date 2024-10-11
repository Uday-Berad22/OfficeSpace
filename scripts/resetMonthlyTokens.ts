import { getDatabase } from '@/lib/database';
import cron from 'node-cron';

async function resetMonthlyTokens() {
  const db = await getDatabase();
  
  await db.collection("users").updateMany(
    {},
    { $set: { tokens: 0 } }
  );

  console.log('Monthly tokens reset successfully');
}

// Schedule the job to run at 00:00 on the first day of each month
cron.schedule('2 * * * *', async () => {
  console.log('Running monthly token reset');
  try {
    await resetMonthlyTokens();
  } catch (error) {
    console.error('Error in monthly token reset:', error);
  }
});

console.log('Cron job scheduled for monthly token reset');
