import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'accounts', timestamps: true })
export class Account extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  userId!: string;

  @Column({ type: DataType.DECIMAL(18, 2), defaultValue: 0 })
  balance!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  currency!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  active!: boolean;
}