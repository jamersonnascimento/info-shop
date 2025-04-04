// This file defines the Product model using Sequelize, which represents the 'product' table in the database.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

// Define the Product model
const Product = sequelize.define('Product', {
  id_produto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome do produto é obrigatório' },
      len: {
        args: [2, 100],
        msg: 'O nome deve ter entre 2 e 100 caracteres'
      }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preco: {
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
  estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: { msg: 'A quantidade em estoque deve ser um número inteiro' },
      min: {
        args: [0],
        msg: 'A quantidade em estoque não pode ser negativa'
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
  tableName: 'product', // Specifies the table name
  timestamps: true, // Enables automatic timestamp fields
  createdAt: 'criado_em', // Maps the createdAt field to 'criado_em'
  updatedAt: 'atualizado_em', // Maps the updatedAt field to 'atualizado_em'
  underscored: true // Uses snake_case for automatically added attributes
});

module.exports = Product;