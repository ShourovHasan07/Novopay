"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const transaction_model_1 = require("../models/transaction.model");
const logger_1 = require("../../../shared/utils/logger");
// Redis connection
const connection = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
});
// Redis connection events
connection.on('connect', () => {
    console.log('[Redis] Connected successfully');
    (0, logger_1.logger)('[Redis] Connected successfully');
});
connection.on('ready', () => {
    console.log('[Redis] Ready to accept commands');
    (0, logger_1.logger)('[Redis] Ready to accept commands');
});
connection.on('error', (err) => {
    console.error('[Redis] Connection error:', err);
    (0, logger_1.logger)('[Redis] Connection error', { error: err });
});
connection.on('close', () => {
    console.warn('[Redis] Connection closed');
    (0, logger_1.logger)('[Redis] Connection closed');
});
connection.on('reconnecting', () => {
    console.log('[Redis] Reconnecting...');
    (0, logger_1.logger)('[Redis] Reconnecting...');
});
// Worker
new bullmq_1.Worker('payroll', async (job) => {
    const transactionId = job.data.transactionId;
    const tx = await transaction_model_1.Transaction.findByPk(transactionId);
    if (!tx)
        return;
    try {
        tx.status = 'completed';
        await tx.save();
        (0, logger_1.logger)('Transaction completed', { transactionId });
    }
    catch (err) {
        let errorMessage = 'Unknown error';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        tx.status = 'failed';
        await tx.save();
        (0, logger_1.logger)('Transaction failed', { transactionId, error: errorMessage });
    }
}, { connection });
