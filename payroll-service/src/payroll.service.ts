import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { payrollQueue } from './queues/payroll.queue';
import { PayrollJob } from './models/payroll-job.model';


@Injectable()
export class PayrollService {
  private readonly logger = new Logger(PayrollService.name);

  // Add payroll job to queue with idempotency
  async enqueuePayroll(
    employerId: string,
    employees: Array<{ id: string; amount: number }>,
    idempotencyKey: string,
  ): Promise<PayrollJob> {
    // Check for duplicate job (idempotency)
    const existing = await PayrollJob.findOne({ where: { employerId, idempotencyKey } });
    if (existing) {
      this.logger.warn(`Duplicate payroll request blocked: ${idempotencyKey}`);
      return existing; // return existing job instead of creating new
    }

    const job = await PayrollJob.create({
      employerId,
      employees,
      status: 'pending',
      idempotencyKey,
    }as any );

    // Queue job with concurrency per employer
    await payrollQueue.add(employerId, { jobId: job.id }, { jobId: job.id });

    this.logger.log(`Payroll job enqueued: ${job.id} for employer ${employerId}`);
    return job;
  }

  // Check job status
  async getJobStatus(jobId: string): Promise<PayrollJob | null> {
    return PayrollJob.findByPk(jobId);
  }
}