const invoicesConsumer = require('./consumers/invoicesConsumer');

const initializeQueueConsumers = async () => {
  await invoicesConsumer();
};

module.exports = initializeQueueConsumers;
