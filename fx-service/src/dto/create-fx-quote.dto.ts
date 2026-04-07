import { IsString, IsNumber, Min, Length } from 'class-validator';

export class CreateFxQuoteDto {
  @IsString()
  @Length(3, 3)
  fromCurrency!: string;

  @IsString()
  @Length(3, 3)
  toCurrency!: string;

  @IsNumber()
  @Min(0.0001)
  rate!: number;
}