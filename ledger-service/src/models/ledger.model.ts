import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

@Table({ tableName: 'ledger_entries', timestamps: true })
export class LedgerEntry extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  id!: string;

  @Index('transaction_id_index') // index for fast search
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  transactionId!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  accountId!: string;

  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  amount!: number;

  @Column({ type: DataType.ENUM('debit', 'credit'), allowNull: false })
  type!: 'debit' | 'credit';

  @Column({ type: DataType.STRING, allowNull: false })
  currency!: string;

//   @Column({ type: DataType.BOOLEAN, defaultValue: true })
//   successful!: boolean; // transaction status
}