const { getChannel } = require('../config/connection');
const User = require('../../database/models/userModel');

const usersConsumer = async () => {
  const channel = await getChannel();

  await channel.assertQueue('user-events-queue', { durable: true });

  await channel.consume('user-events-queue', async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());

      if (content.event === 'USER_CREATED') {
        const { id, email } = content;

        await User.findOrCreate({
          where: { id },
          defaults: { email }
        });

        console.log(`Usuario replicado localmente: ID ${id}`);
      }

      channel.ack(msg);
    } catch (error) {
      console.error('Error procesando evento USER_CREATED:', error.message);
      channel.nack(msg, false, true);
    }
  });

  console.log('Escuchando eventos de usuario...');
};

module.exports = usersConsumer;
