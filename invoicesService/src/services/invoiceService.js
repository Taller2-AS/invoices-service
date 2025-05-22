const Invoice = require('../database/models/invoiceModel');
const { getChannel, EXCHANGE_NAME } = require('../queue/config/connection');

const createInvoice = async (call, callback) => {
  try {
    const { cliente, monto } = call.request;

    const newInvoice = await Invoice.create({ cliente, monto });

    const channel = await getChannel();
    channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify({
      event: 'INVOICE_CREATED',
      id: newInvoice.id,
      cliente,
      monto,
      timestamp: new Date().toISOString()
    })));

    callback(null, {
      id: newInvoice.id,
      cliente: newInvoice.cliente,
      monto: newInvoice.monto,
      estado: newInvoice.estado,
      createdAt: newInvoice.createdAt.toISOString(),
      updatedAt: newInvoice.updatedAt.toISOString()
    });
  } catch (err) {
    callback(err);
  }
};

const getInvoiceById = async (call, callback) => {
  try {
    const { id } = call.request;
    const invoice = await Invoice.findByPk(id);

    if (!invoice) return callback(new Error('Factura no encontrada'));

    callback(null, {
      id: invoice.id,
      cliente: invoice.cliente,
      monto: invoice.monto,
      estado: invoice.estado,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString()
    });
  } catch (err) {
    callback(err);
  }
};

const updateInvoice = async (call, callback) => {
  try {
    const { id, cliente, monto, estado } = call.request;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) return callback(new Error('Factura no encontrada'));

    invoice.cliente = cliente || invoice.cliente;
    invoice.monto = monto || invoice.monto;
    invoice.estado = estado || invoice.estado;

    await invoice.save();

    const channel = await getChannel();
    channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify({
      event: 'INVOICE_UPDATED',
      id: invoice.id,
      timestamp: new Date().toISOString()
    })));

    callback(null, {
      id: invoice.id,
      cliente: invoice.cliente,
      monto: invoice.monto,
      estado: invoice.estado,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString()
    });
  } catch (err) {
    callback(err);
  }
};

const deleteInvoice = async (call, callback) => {
  try {
    const { id } = call.request;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) return callback(new Error('Factura no encontrada'));

    await invoice.destroy();

    const channel = await getChannel();
    channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify({
      event: 'INVOICE_DELETED',
      id,
      timestamp: new Date().toISOString()
    })));

    callback(null, {});
  } catch (err) {
    callback(err);
  }
};

const listInvoices = async (call, callback) => {
  try {
    const invoices = await Invoice.findAll();

    const response = invoices.map(inv => ({
      id: inv.id,
      cliente: inv.cliente,
      monto: inv.monto,
      estado: inv.estado,
      createdAt: inv.createdAt.toISOString(),
      updatedAt: inv.updatedAt.toISOString()
    }));

    callback(null, { invoices: response });
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  CreateInvoice: createInvoice,
  GetInvoiceById: getInvoiceById,
  UpdateInvoice: updateInvoice,
  DeleteInvoice: deleteInvoice,
  ListInvoices: listInvoices
};
