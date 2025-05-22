const Invoice = require('../database/models/invoiceModel');
const generateFakeInvoice = require('../fakers/invoiceFaker');

const insertFakeInvoices = async (cantidad = 300) => {
  try {
    const invoices = Array.from({ length: cantidad }, () => generateFakeInvoice());
    await Invoice.bulkCreate(invoices);
    console.log(`${cantidad} facturas insertadas correctamente.`);
  } catch (err) {
    console.error('Error al insertar facturas:', err.message);
    throw err;
  }
};

module.exports = insertFakeInvoices;
