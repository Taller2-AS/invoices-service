const dotenv = require('dotenv');
const sequelize = require('../sequelize');
const insertFakeInvoices = require('./invoiceSeeder');

dotenv.config();

const main = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: process.argv.includes('--fresh') });

    if (process.argv.includes('--fresh')) {
      console.log('Base de datos limpiada');
    }

    await insertFakeInvoices(300);
  } catch (err) {
    console.error('Error al ejecutar seeder:', err.message);
  } finally {
    await sequelize.close();
    console.log('Conexión cerrada con la base de datos');
  }
};

main();
