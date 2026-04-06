import { Injectable } from '@nestjs/common';
import { Account } from './models/account.model';

@Injectable()
export class AccountService {
  async createAccount(userId: string, currency = 'USD') {
    return Account.create({ userId, currency });
  }

  async getBalance(userId: string) {
  const account = await Account.findOne({ where: { userId } });
  if (!account) {
    throw new Error(`Account not found for userId: ${userId}`);
  }
  return account.balance;
}
}