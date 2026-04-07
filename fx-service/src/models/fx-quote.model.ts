import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'fx_quotes', timestamps: true })
export class FxQuote extends Model<FxQuote> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  fromCurrency!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  toCurrency!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  rate!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  expiresAt!: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  used!: boolean;
}