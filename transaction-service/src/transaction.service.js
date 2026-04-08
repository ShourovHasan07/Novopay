"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const transaction_model_1 = require("./models/transaction.model");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("../../shared/utils/logger");
const connection = new ioredis_1.default({ host: process.env.REDIS_HOST || 'localhost', port: 6379 });
const payrollQueue = new bullmq_1.Queue('payroll', { connection });
let TransactionService = class TransactionService {
    async createTransaction(payload) {
        // Check idempotency
        const existing = await transaction_model_1.Transaction.findOne({
            where: { idempotencyKey: payload.idempotencyKey },
        });
        if (existing)
            return existing;
        // Create transaction pending
        const transaction = await transaction_model_1.Transaction.create({
            ...payload,
            currency: payload.currency || 'USD',
            status: 'pending',
        });
        // Add to payroll queue
        await payrollQueue.add('process-transaction', { transactionId: transaction.id }, { removeOnComplete: true });
        (0, logger_1.logger)(`Transaction queued`, { transactionId: transaction.id });
        console.log('Transaction queued', transaction.id);
        return transaction;
    }
    async getTransaction(id) {
        return transaction_model_1.Transaction.findByPk(id);
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)()
], TransactionService);
