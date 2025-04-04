// This file defines the Order model using Sequelize, which represents the 'order' table in the database.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Client = require('./client.model');

// Define the Order model
const Order = sequelize.define('Order', {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client, // References the Client model
      key: 'id_cliente'
    },
    validate: {
      notNull: { msg: 'ID do cliente é obrigatório' },
      isInt: { msg: 'ID do cliente deve ser um número inteiro' }
    }
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pendente',
    validate: {
      notEmpty: { msg: 'O status do pedido é obrigatório' }
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      isDecimal: { msg: 'O total deve ser um valor decimal válido' },
      min: {
        args: [0],
        msg: 'O total não pode ser negativo'
      }
    }
  },
  id_cupom: {
    type: DataTypes.INTEGER,
    allowNull: true
    // Reference to the Coupon model when implemented
  },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  atualizado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'order', // Specifies the table name
  timestamps: true, // Enables automatic timestamp fields
  createdAt: 'criado_em', // Maps the createdAt field to 'criado_em'
  updatedAt: 'atualizado_em', // Maps the updatedAt field to 'atualizado_em'
  underscored: true // Uses snake_case for automatically added attributes
});

module.exports = Order;