
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'audit_logs',
  timestamps: true, // createdAt, updatedAt
})
export class AuditLog extends Model<AuditLog> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id!: string;

  @Column({ allowNull: false })
  userId!: string;

  @Column({ allowNull: false })
  action!: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  metadata?: any;
}