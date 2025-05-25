const { getChannel } = require('../config/connection');

const invoicesConsumer = async () => {
  const channel = await getChannel();

  await channel.assertQueue('invoice-events-queue', { durable: true });

  await channel.consume('invoice-events-queue', async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());

      console.log('Evento recibido desde invoice-events-queue:');
      console.log(content);

      channel.ack(msg);
    } catch (error) {
      console.error('Error al procesar mensaje:', error.message);
      channel.nack(msg, false, true);
    }
  });

  console.log('Escuchando mensajes en "invoice-events-queue"...');
};

module.exports = invoicesConsumer;
