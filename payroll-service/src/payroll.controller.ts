import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PayrollService } from './payroll.service';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  async create(@Body() body: { employerId: string; employees: Array<{id: string, amount: number}>; idempotencyKey: string }) {
    const { employerId, employees, idempotencyKey } = body;
    return this.payrollService.enqueuePayroll(employerId, employees, idempotencyKey);
  }

  @Get(':jobId')
  async status(@Param('jobId') jobId: string) {
    return this.payrollService.getJobStatus(jobId);
  }
}