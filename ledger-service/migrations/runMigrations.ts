import { Sequelize } from 'sequelize-typescript';
import { LedgerEntry } from '../src/models/ledger.model';
import { readdirSync } from 'fs';
import path from 'path';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'shourov123',
  database: 'novapay_db',
  models: [LedgerEntry],
});

async function runMigrations() {
  const migrationsPath = path.join(__dirname);
  const files = readdirSync(migrationsPath).filter(f => f.endsWith('.ts'));

  for (const file of files) {
    const migration = await import(path.join(migrationsPath, file));
    console.log('Running migration:', file);
    await migration.up(sequelize.getQueryInterface(), Sequelize);
  }

  console.log('All migrations completed');
  await sequelize.close();
}

runMigrations().catch(err => {
  console.error(err);
  process.exit(1);
});
