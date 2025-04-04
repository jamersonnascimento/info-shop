// This file defines the OrderItem model using Sequelize, which represents the 'order_item' table in the database.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Order = require('./order.model');
const Product = require('./product.model');

// Define the OrderItem model
const OrderItem = sequelize.define('OrderItem', {
  id_item_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order, // References the Order model
      key: 'id_pedido'
    },
    validate: {
      notNull: { msg: 'ID do pedido é obrigatório' },
      isInt: { msg: 'ID do pedido deve ser um número inteiro' }
    }
  },
  id_produto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product, // References the Product model
      key: 'id_produto'
    },
    validate: {
      notNull: { msg: 'ID do produto é obrigatório' },
      isInt: { msg: 'ID do produto deve ser um número inteiro' }
    }
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      isInt: { msg: 'A quantidade deve ser um número inteiro' },
      min: {
        args: [1],
        msg: 'A quantidade deve ser maior que zero'
      }
    }
  },
  preco_unit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'O preço deve ser um valor decimal válido' },
      min: {
        args: [0.01],
        msg: 'O preço deve ser maior que zero'
      }
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'O subtotal deve ser um valor decimal válido' },
      min: {
        args: [0.01],
        msg: 'O subtotal deve ser maior que zero'
      }
    }
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
  tableName: 'order_item', // Specifies the table name
  timestamps: true, // Enables automatic timestamp fields
  createdAt: 'criado_em', // Maps the createdAt field to 'criado_em'
  updatedAt: 'atualizado_em', // Maps the updatedAt field to 'atualizado_em'
  underscored: true, // Uses snake_case for automatically added attributes
  indexes: [
    {
      unique: true,
      fields: ['id_pedido', 'id_produto'] // Ensures unique combination of order and product
    }
  ]
});

module.exports = OrderItem;