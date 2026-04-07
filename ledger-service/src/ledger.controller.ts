import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { CreateLedgerDto } from './dto/create-ledger.dto';

@Controller('ledger')
export class LedgerController {
  private readonly logger = new Logger(LedgerController.name);

  constructor(private readonly ledgerService: LedgerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async record(@Body() dto: CreateLedgerDto) {
    this.logger.log(
      `Received transaction request: ${dto.transactionId} from ${dto.senderId} to ${dto.recipientId}`,
    );
    return this.ledgerService.recordTransaction(
      dto.transactionId,
      dto.senderId,
      dto.recipientId,
      dto.amount,
      dto.currency,
    );
  }

  @Get(':transactionId')
  async get(@Param('transactionId') transactionId: string) {
    this.logger.log(`Fetching ledger entries for transaction: ${transactionId}`);
    return this.ledgerService.getEntriesByTransaction(transactionId);
  }
}