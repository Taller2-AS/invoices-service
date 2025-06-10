const Invoice = require('../database/models/invoiceModel');
const { getChannel, EXCHANGE_NAME } = require('../queue/config/connection');
const publishLog = require('../queue/publisher/logPublisher');
const User = require('../database/models/userModel');

const createInvoice = async (call, callback) => {
  try {
    const { userId, monto, estado } = call.request;

    const newInvoice = await Invoice.create({
      userId,
      monto,
      estado: estado || 'Pendiente'
    });

    const channel = await getChannel();
    channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify({
      event: 'INVOICE_CREATED',
      id: newInvoice.id,
      userId,
      monto,
      estado: newInvoice.estado,
      timestamp: new Date().toISOString()
    })));

    await publishLog('action', {
      userId,
      email: '',
      method: 'CreateInvoice',
      url: '/invoices',
      action: 'CREAR FACTURA',
      date: new Date().toISOString()
    });

    callback(null, {
      id: newInvoice.id,
      userId: newInvoice.userId,
      monto: newInvoice.monto,
      estado: newInvoice.estado,
      createdAt: newInvoice.createdAt.toISOString(),
      updatedAt: newInvoice.updatedAt.toISOString()
    });
  } catch (err) {
    await publishLog('error', {
      userId: null,
      email: '',
      error: err.message,
      date: new Date().toISOString()
    });
    callback(err);
  }
};

const getInvoiceById = async (call, callback) => {
  try {
    const { id } = call.request;
    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      await publishLog('error', {
        userId: null,
        email: '',
        error: 'Factura no encontrada',
        date: new Date().toISOString()
      });
      return callback(new Error('Factura no encontrada'));
    }

    callback(null, {
      id: invoice.id,
      userId: invoice.userId,
      monto: invoice.monto,
      estado: invoice.estado,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString()
    });
  } catch (err) {
    await publishLog('error', {
      userId: null,
      email: '',
      error: err.message,
      date: new Date().toISOString()
    });
    callback(err);
  }
};

const updateInvoice = async (call, callback) => {
  try {
    const { id, estado } = call.request;

    if (!id || !estado) {
      return callback(new Error('Faltan campos obligatorios: id y estado'));
    }

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      await publishLog('error', {
        userId: null,
        email: '',
        error: 'Factura no encontrada',
        date: new Date().toISOString()
      });
      return callback(new Error('Factura no encontrada'));
    }

    invoice.estado = estado;
    if (estado === 'Pagado') {
      invoice.fechaPago = new Date();
    }

    await invoice.save();

    const user = await User.findByPk(invoice.userId);
    if (!user) {
      console.warn(`⚠️ Usuario no encontrado para userId: ${invoice.userId}`);
    }

    const channel = await getChannel();
    channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify({
      event: 'INVOICE_UPDATED',
      id: invoice.id,
      userId: invoice.userId,
      monto: invoice.monto,
      estado: invoice.estado,
      email: user?.email || '',
      nombre: user?.nombre || '',
      timestamp: new Date().toISOString()
    })));

    await publishLog('action', {
      userId: invoice.userId,
      email: user?.email || '',
      method: 'UpdateInvoice',
      url: `/invoices/${id}`,
      action: 'ACTUALIZAR FACTURA',
      date: new Date().toISOString()
    });

    callback(null, {
      id: invoice.id,
      userId: invoice.userId,
      monto: invoice.monto,
      estado: invoice.estado,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      fechaPago: invoice.fechaPago ? invoice.fechaPago.toISOString() : null
    });
  } catch (err) {
    await publishLog('error', {
      userId: null,
      email: '',
      error: err.message,
      date: new Date().toISOString()
    });
    callback(err);
  }
};

const deleteInvoice = async (call, callback) => {
  try {
    const { id } = call.request;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      await publishLog('error', {
        userId: null,
        email: '',
        error: 'Factura no encontrada',
        date: new Date().toISOString()
      });
      return callback(new Error('Factura no encontrada'));
    }

    await invoice.destroy();

    const channel = await getChannel();
    channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify({
      event: 'INVOICE_DELETED',
      id,
      timestamp: new Date().toISOString()
    })));

    await publishLog('action', {
      userId: invoice.userId,
      email: '',
      method: 'DeleteInvoice',
      url: `/invoices/${id}`,
      action: 'ELIMINAR FACTURA',
      date: new Date().toISOString()
    });

    callback(null, {});
  } catch (err) {
    await publishLog('error', {
      userId: null,
      email: '',
      error: err.message,
      date: new Date().toISOString()
    });
    callback(err);
  }
};

const listInvoices = async (call, callback) => {
  try {
    const invoices = await Invoice.findAll();

    const response = invoices.map(inv => ({
      id: inv.id,
      userId: inv.userId,
      monto: inv.monto,
      estado: inv.estado,
      createdAt: inv.createdAt.toISOString(),
      updatedAt: inv.updatedAt.toISOString()
    }));

    callback(null, { invoices: response });
  } catch (err) {
    await publishLog('error', {
      userId: null,
      email: '',
      error: err.message,
      date: new Date().toISOString()
    });
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
