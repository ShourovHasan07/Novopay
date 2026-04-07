

import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Centralized Sequelize instance for all services
 * Reusable in Admin, Payroll, Transaction, Ledger, etc.
 */
export const sequelize = new Sequelize({
  dialect: 'postgres', // or 'mysql', 'sqlite', etc.
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'shourov123',
  database: process.env.DB_NAME || 'nova_pay',
  logging: false, // set to console.log for debugging
  models: [__dirname + '/../../services/**/src/modules/**/*.model.ts'], // Auto-load models from all services
  pool: {
    max: 20,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync({ alter: false }); // set alter:true for dev, false for production
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};