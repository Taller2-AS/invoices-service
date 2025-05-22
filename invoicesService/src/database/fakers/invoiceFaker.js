const { faker } = require('@faker-js/faker');

const generateFakeInvoice = () => ({
  cliente: faker.company.name(),
  monto: parseFloat(faker.finance.amount(1000, 10000, 2)),
  estado: faker.helpers.arrayElement(['Pendiente', 'Pagado', 'Vencido'])
});

module.exports = generateFakeInvoice;
