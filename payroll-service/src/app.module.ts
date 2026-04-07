

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { PayrollJob } from './models/payroll-job.model';
import * as dotenv from 'dotenv';
dotenv.config();



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get<string>('POSTGRES_HOST', 'localhost'),
        port: parseInt(config.get<string>('POSTGRES_PORT', '5432')),
        username: config.get<string>('POSTGRES_USER', 'postgres'),
        password: config.get<string>('POSTGRES_PASSWORD', 'shourov123'),
        database: config.get<string>('POSTGRES_DB', 'novapay_db'),
        models: [PayrollJob],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    SequelizeModule.forFeature([PayrollJob]),
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class AppModule {}