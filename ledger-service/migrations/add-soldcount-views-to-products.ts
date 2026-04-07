import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('ledger_entries', 'successful', {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  // boolean 
    allowNull: false,
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('ledger_entries', 'successful');
}