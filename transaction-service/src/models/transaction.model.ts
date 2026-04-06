import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'transactions', timestamps: true })
export class Transaction extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  senderId!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  recipientId!: string;

  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  amount!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  currency!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  idempotencyKey!: string;

  @Column({ type: DataType.STRING, defaultValue: 'pending' })
  status!: 'pending' | 'completed' | 'failed';
}