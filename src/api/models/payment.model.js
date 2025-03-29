const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Order = require('./order.model');

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
    unique: true, // Garante relação 1:1 com Order
    references: {
      model: Order,
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
    defaultValue: 'pendente', // Sempre começa como pendente
    validate: {
      notNull: { msg: 'Status é obrigatório' }
    }
  },
  data_pagamento: {
    type: DataTypes.DATE,
    allowNull: true, // Só é preenchido quando o pagamento é aprovado
  },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Timestamp automático
  },
  atualizado_em: {
    type: DataTypes.DATE,
    allowNull: false, // Podemos voltar para false
    defaultValue: DataTypes.NOW // Timestamp automático
  }
}, {
  tableName: 'payment',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
  underscored: true
});

module.exports = Payment;