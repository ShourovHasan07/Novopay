import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { FxService } from './fx.service';
import { CreateFxQuoteDto } from './dto/create-fx-quote.dto';

@Controller('fx')
export class FxController {
  constructor(private readonly fxService: FxService) {}

  @Post('quote')
  async createQuote(@Body() dto: CreateFxQuoteDto) {
    return this.fxService.createQuote(dto.fromCurrency, dto.toCurrency, dto.rate);
  }

  @Get('quote/:id')
  async validateQuote(@Param('id') id: string) {
    return this.fxService.validateQuote(id);
  }

  @Patch('quote/:id/use')
  async useQuote(@Param('id') id: string) {
    return this.fxService.useQuote(id);
  }
}