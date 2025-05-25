const invoicesConsumer = require('./consumers/invoicesConsumer');
const usersConsumer = require('./consumers/usersConsumer');

const initializeQueueConsumers = async () => {
  await invoicesConsumer();
  await usersConsumer();
};

module.exports = initializeQueueConsumers;
