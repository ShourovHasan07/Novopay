import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { FxQuote } from './models/fx-quote.model';
import { v4 as uuidv4 } from 'uuid';
import { Op, Sequelize } from 'sequelize';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';

@Injectable()
export class FxService {
  private readonly logger = new Logger(FxService.name);

  constructor(
    @InjectModel(FxQuote)
    private readonly fxQuoteModel: typeof FxQuote, //  use typeof FxQuote
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Create a locked FX quote (TTL 60s)
   */
  async createQuote(fromCurrency: string, toCurrency: string, rate: number): Promise<FxQuote> {
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds TTL
    const quote = await this.fxQuoteModel.create({
      id: uuidv4(),
      fromCurrency,
      toCurrency,
      rate,
      expiresAt,
      used: false,
    }as any);
    this.logger.log(`FX quote issued: ${quote.id}`);
    return quote;
  }

  /**
   * Validate FX quote
   */
  async validateQuote(id: string): Promise<FxQuote> {
    const quote = await this.fxQuoteModel.findOne({
      where: { id, used: false, expiresAt: { [Op.gt]: new Date() } },
    });

    if (!quote) {
      this.logger.warn(`Invalid or expired FX quote: ${id}`);
      throw new BadRequestException('Invalid, expired, or already used FX quote');
    }

    return quote;
  }

  /**
   * Mark FX quote as used
   */
  async useQuote(id: string): Promise<FxQuote> {
    return await this.sequelize.transaction(async (t) => {
      const quote = await this.fxQuoteModel.findOne({
        where: { id, used: false, expiresAt: { [Op.gt]: new Date() } },
        transaction: t,
        lock: t.LOCK.UPDATE, // row-level lock
      });

      if (!quote) {
        this.logger.warn(`Attempt to reuse or expired FX quote: ${id}`);
        throw new BadRequestException('Invalid, expired, or already used FX quote');
      }

      quote.used = true;
      await quote.save({ transaction: t });
      this.logger.log(`FX quote used: ${quote.id}`);
      return quote;
    });
  }
}