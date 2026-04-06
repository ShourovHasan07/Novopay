import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
async create(@Body() body: any) {
  const userId = body.userId;
  return this.accountService.createAccount(userId);
}

  @Get(':userId/balance')
  async balance(@Param('userId') userId: string) {
    return { balance: await this.accountService.getBalance(userId) };
  }
}