import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Transaction } from '../models/transaction.model';
import { logger } from '../../../shared/utils/logger';

// Redis connection
const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

// Redis connection events
connection.on('connect', () => {
  console.log('[Redis] Connected successfully');
  logger('[Redis] Connected successfully');
});

connection.on('ready', () => {
  console.log('[Redis] Ready to accept commands');
  logger('[Redis] Ready to accept commands');
});

connection.on('error', (err) => {
  console.error('[Redis] Connection error:', err);
  logger('[Redis] Connection error', { error: err });
});

connection.on('close', () => {
  console.warn('[Redis] Connection closed');
  logger('[Redis] Connection closed');
});

connection.on('reconnecting', () => {
  console.log('[Redis] Reconnecting...');
  logger('[Redis] Reconnecting...');
});

// Worker
new Worker(
  'payroll',
  async (job) => {
    const transactionId = job.data.transactionId;
    const tx = await Transaction.findByPk(transactionId);
    if (!tx) return;

    try {
      tx.status = 'completed';
      await tx.save();
      logger('Transaction completed', { transactionId });
    } catch (err: unknown) {
      let errorMessage = 'Unknown error';
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      tx.status = 'failed';
      await tx.save();
      logger('Transaction failed', { transactionId, error: errorMessage });
    }
  },
  { connection },
);