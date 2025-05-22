const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Pagado', 'Vencido'),
    defaultValue: 'Pendiente'
  }
}, {
  timestamps: true,
  tableName: 'facturas'
});

module.exports = Invoice;
