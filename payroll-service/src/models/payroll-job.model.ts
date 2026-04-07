import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'payroll_jobs', timestamps: true })
export class PayrollJob extends Model<PayrollJob> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  employerId!: string;

  @Column({ type: DataType.JSONB, allowNull: false })
  employees!: Array<{ id: string; amount: number }>;

  @Column({ type: DataType.STRING, defaultValue: 'pending' })
  status!: 'pending' | 'processing' | 'completed' | 'failed';

  @Column({ type: DataType.JSONB, allowNull: true })
  results?: Array<{ employeeId: string; transactionId: string; status: string }>;

  @Column({ type: DataType.STRING, allowNull: true })
  idempotencyKey?: string;
}