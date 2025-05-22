const amqp = require('amqplib');

let channel;

const QUEUE_NAME = 'invoice-events-queue';
const EXCHANGE_NAME = 'invoice-events-exchange';

async function connectToRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: true });
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, '');

  console.log('Conectado a RabbitMQ y cola configurada [invoices]');
  return channel;
}

async function getChannel() {
  if (!channel) {
    channel = await connectToRabbitMQ();
  }
  return channel;
}

module.exports = {
  getChannel,
  EXCHANGE_NAME,
};
