import { Injectable } from '@nestjs/common';
import { Transaction } from './models/transaction.model';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from '@shared/utils/logger';

const connection = new IORedis({ host: process.env.REDIS_HOST || 'localhost', port: 6379 });
const payrollQueue = new Queue('payroll', { connection });

@Injectable()
export class TransactionService {
  async createTransaction(payload: {
    senderId: string;
    recipientId: string;
    amount: number;
    currency?: string;
    idempotencyKey: string;
  }) {
    // Check idempotency
    const existing: Transaction | null = await Transaction.findOne({
      where: { idempotencyKey: payload.idempotencyKey },
    });
    if (existing) return existing;

    // Create transaction pending
    const transaction = await Transaction.create({
      ...payload,
      currency: payload.currency || 'USD',
      status: 'pending',
    });

    // Add to payroll queue
    await payrollQueue.add('process-transaction', { transactionId: transaction.id }, { removeOnComplete: true });

    logger(`Transaction queued`, { transactionId: transaction.id });
    console.log('Transaction queued', transaction.id);
    return transaction;
  }

  async getTransaction(id: string) {
    return Transaction.findByPk(id);
  }
}