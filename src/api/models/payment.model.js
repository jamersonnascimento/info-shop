// This file defines the Payment model using Sequelize, which represents the 'payment' table in the database.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Order = require('./order.model');

// Define the Payment model
const Payment = sequelize.define('Payment', {
  id_pagamento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Ensures a 1:1 relationship with Order
    references: {
      model: Order, // References the Order model
      key: 'id_pedido'
    },
    validate: {
      notNull: { msg: 'ID do pedido é obrigatório' },
      isInt: { msg: 'ID do pedido deve ser um número inteiro' }
    }
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: { msg: 'Valor é obrigatório' },
      isDecimal: { msg: 'Valor deve ser um número decimal' },
      min: { args: [0.01], msg: 'Valor deve ser maior que zero' }
    }
  },
  metodo: {
    type: DataTypes.ENUM('cartao_credito', 'cartao_debito', 'pix', 'boleto'),
    allowNull: false,
    validate: {
      notNull: { msg: 'Método de pagamento é obrigatório' }
    }
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aprovado', 'recusado', 'estornado'),
    allowNull: false,
    defaultValue: 'pendente', // Always starts as pending
    validate: {
      notNull: { msg: 'Status é obrigatório' }
    }
  },
  data_pagamento: {
    type: DataTypes.DATE,
    allowNull: true, // Only filled when payment is approved
  },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Automatic timestamp
  },
  atualizado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Automatic timestamp
  }
}, {
  tableName: 'payment', // Specifies the table name
  timestamps: true, // Enables automatic timestamp fields
  createdAt: 'criado_em', // Maps the createdAt field to 'criado_em'
  updatedAt: 'atualizado_em', // Maps the updatedAt field to 'atualizado_em'
  underscored: true // Uses snake_case for automatically added attributes
});

module.exports = Payment;