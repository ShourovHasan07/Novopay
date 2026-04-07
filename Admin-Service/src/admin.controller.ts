// src/admin/admin.controller.ts
import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('audit-log')
  async createAuditLog(
    @Body('userId') userId: string,
    @Body('action') action: string,
    @Body('metadata') metadata?: any,
  ) {
    return this.adminService.createAuditLog(userId, action, metadata);
  }

  @Get('audit-logs')
  async getAuditLogs(@Query('limit') limit?: number) {
    return this.adminService.getAuditLogs(limit || 50);
  }

  @Get('audit/user/:userId')
  async listUserAudit(@Param('userId') userId: string, @Query('limit') limit?: number) {
    return this.adminService.getUserAuditLogs(userId, limit || 50);
  }
}