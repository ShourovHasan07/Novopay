"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const transaction_controller_1 = require("./transaction.controller");
const transaction_service_1 = require("./transaction.service");
const transaction_model_1 = require("./models/transaction.model");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            sequelize_1.SequelizeModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    dialect: 'postgres',
                    host: config.get('POSTGRES_HOST', 'localhost'),
                    port: parseInt(config.get('POSTGRES_PORT', '5432')),
                    username: config.get('POSTGRES_USER', 'postgres'),
                    password: config.get('POSTGRES_PASSWORD', 'shourov123'),
                    database: config.get('POSTGRES_DB', 'novapay_db'),
                    models: [transaction_model_1.Transaction],
                    autoLoadModels: true,
                    synchronize: true,
                }),
            }),
            sequelize_1.SequelizeModule.forFeature([transaction_model_1.Transaction]),
        ],
        controllers: [transaction_controller_1.TransactionController],
        providers: [transaction_service_1.TransactionService],
    })
], AppModule);
