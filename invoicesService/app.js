const dotenv = require('dotenv');
const grpc = require('@grpc/grpc-js');
const loadProto = require('./src/utils/loadProto');
const invoiceService = require('./src/services/invoiceService');
const sequelize = require('./src/database/sequelize');
const initializeQueueConsumers = require('./src/queue');

dotenv.config({ path: './.env' });

// Conexión a MariaDB con Sequelize
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a base de datos MariaDB exitosa');
    return sequelize.sync(); // sincroniza modelos
  })
  .catch((err) => {
    console.error('Error de conexión con MariaDB:', err.message);
    process.exit(1);
  });

// Inicializar consumidores de RabbitMQ
initializeQueueConsumers()
  .then(() => console.log('RabbitMQ Consumers inicializados'))
  .catch(err => {
    console.error('Error iniciando consumidores:');
    console.error(err);
  });

// Servidor gRPC
const server = new grpc.Server();
const InvoiceProto = loadProto('invoice');

server.addService(InvoiceProto.InvoiceService.service, invoiceService);

const PORT = process.env.GRPC_PORT || 50052;
const HOST = process.env.SERVER_URL || 'localhost';

server.bindAsync(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Fallo al iniciar servidor gRPC:', err.message);
    return;
  }
  console.log(`Servidor gRPC de facturas escuchando en ${HOST}:${port}`);
  server.start();
});
