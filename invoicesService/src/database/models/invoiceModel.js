const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING(36),  
    allowNull: false
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Pagado', 'Vencido'),
    allowNull: false,
    defaultValue: 'Pendiente'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaPago: {
  type: DataTypes.DATE,
  allowNull: true
  }
  
}, {
  tableName: 'facturas',
  timestamps: true
});

module.exports = Invoice;
