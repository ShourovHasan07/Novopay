import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuditLog } from './models/audit-log.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
SequelizeModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    dialect: 'postgres',
    host: config.get<string>('POSTGRES_HOST', 'localhost'),
    port: parseInt(config.get<string>('POSTGRES_PORT', '5432')),
    username: config.get<string>('POSTGRES_USER', 'postgres'),
    password: config.get<string>('POSTGRES_PASSWORD', 'shourov123'),
    database: config.get<string>('POSTGRES_DB', 'novapay_db'),
    models: [AuditLog], // must be class with @Table
    autoLoadModels: true,
    synchronize: true,
  }),
}),
SequelizeModule.forFeature([AuditLog]),
    // Register models for DI in services
    SequelizeModule.forFeature([AuditLog]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AppModule {}