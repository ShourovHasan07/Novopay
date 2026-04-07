import { Injectable, BadRequestException } from '@nestjs/common';
import { AuditLog } from './models/audit-log.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdminService {

  /**
   * Create a new audit log entry.
   * Idempotent: avoids duplicate logs with same requestId (optional metadata)
   */
  async createAuditLog(
    userId: string,
    action: string,
    metadata?: { requestId?: string; [key: string]: any },
  ): Promise<AuditLog> {
    if (!userId || !action) {
      throw new BadRequestException('userId and action are required');
    }

    // Optional idempotency: avoid duplicate logs for same request
    if (metadata?.requestId) {
      const existing = await AuditLog.findOne({
        where: { metadata: { requestId: metadata.requestId } },
      });
      if (existing) return existing;
    }

    return AuditLog.create({
      id: uuidv4(),
      userId,
      action,
      metadata,
    }as any );
  }

  /**
   * Fetch recent audit logs
   * Supports pagination: limit and offset
   */
  async getAuditLogs(
    limit = 50,
    offset = 0,
  ): Promise<AuditLog[]> {
    return AuditLog.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  /**
   * Fetch audit logs by user
   */
  async getUserAuditLogs(
    userId: string,
    limit = 50,
  ): Promise<AuditLog[]> {
    return AuditLog.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
    });
  }
}