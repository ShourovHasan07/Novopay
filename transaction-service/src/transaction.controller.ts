

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly txService: TransactionService) {}

  @Post()
  async create(@Body() body: any) {
    return this.txService.createTransaction(body);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.txService.getTransaction(id);
  }
}