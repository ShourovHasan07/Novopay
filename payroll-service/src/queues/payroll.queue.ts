import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { PayrollJob } from '../models/payroll-job.model';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../../shared/utils/logger';

//  FIXED Redis connection
const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null, //  VERY IMPORTANT
});

export const payrollQueue = new Queue('payroll-queue', { connection });

// Worker: concurrency per employer = 1
export const payrollWorker = new Worker(
  'payroll-queue',
  async (job: Job) => {
    const { jobId } = job.data;

    const payrollJob = await PayrollJob.findByPk(jobId);
    if (!payrollJob) throw new Error(`Payroll job not found: ${jobId}`);

    payrollJob.status = 'processing';
    await payrollJob.save();

    const results: Array<{ employeeId: string; transactionId: string; status: string }> = [];

    for (const emp of payrollJob.employees) {
      // Simulate disbursement
      const transactionId = uuidv4();

      results.push({
        employeeId: emp.id,
        transactionId,
        status: 'success',
      });
    }

    payrollJob.status = 'completed';
    payrollJob.results = results;
    await payrollJob.save();

    logger(`Payroll job completed: ${jobId}`, { jobId });

    return results;
  },
  {
    connection,
    concurrency: 1, //  ensures one job at a time
  },
);