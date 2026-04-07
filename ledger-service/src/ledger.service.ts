import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { LedgerEntry } from './models/ledger.model';

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor(
    @InjectModel(LedgerEntry)
    private readonly ledgerModel: typeof LedgerEntry,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Record a double-entry transaction (Debit/Credit)
   * Idempotency key: transactionId
   */
  async recordTransaction(
    transactionId: string,
    senderId: string,
    recipientId: string,
    amount: number,
    currency = 'USD',
  ) {
    // 1️ Validation
    if (!transactionId || !senderId || !recipientId) {
      throw new BadRequestException('Missing required fields');
    }
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const transaction = await this.sequelize.transaction();

    try {
      //  Idempotency Check
      const existing = await this.ledgerModel.findOne({
        where: { transactionId },
        transaction,
      });

      if (existing) {
        this.logger.warn(`Duplicate transaction attempt: ${transactionId}`);
        throw new BadRequestException('Transaction already processed');
      }

      //  Create Debit
      const debit = await this.ledgerModel.create(
        {
          transactionId,
          accountId: senderId,
          amount,
          type: 'debit',
          currency,
          // successful: true,
        
        },
        { transaction },
      );

      //  Create Credit
      const credit = await this.ledgerModel.create(
        {
          transactionId,
          accountId: recipientId,
          amount,
          type: 'credit',
          currency,
         // successful: true,
        },
        { transaction },
      );

      //  Ledger Invariant Check
      if (Number(debit.amount) !== Number(credit.amount)) {
        throw new Error('Ledger imbalance detected');
      }

      await transaction.commit();

      this.logger.log(`Transaction successful: ${transactionId}`);
      return {
        success: true,
        message: 'Transaction recorded successfully',
        data: { debit, credit },
      };
    } catch (error: unknown) {
      await transaction.rollback();

      this.logger.error(`Transaction failed: ${transactionId}`, error as any);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);

      throw new InternalServerErrorException('Ledger transaction failed');
    }
  }

  /**
   * Get all ledger entries for a given transaction
   */
  async getEntriesByTransaction(transactionId: string) {
    if (!transactionId) {
      throw new BadRequestException('TransactionId is required');
    }

    try {
      return await this.ledgerModel.findAll({
        where: { transactionId },
        order: [['createdAt', 'ASC']],
      });
    } catch (error: unknown) {
      this.logger.error(`Failed to fetch entries for ${transactionId}`, error as any);
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Failed to fetch entries');
    }
  }
}