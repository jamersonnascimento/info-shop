// This file defines the Category model using Sequelize, which represents the 'category' table in the database.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

// Define the Category model
const Category = sequelize.define('Category', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome da categoria é obrigatório' },
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
  tableName: 'category', // Specifies the table name
  timestamps: true, // Enables automatic timestamp fields
  createdAt: 'criado_em', // Maps the createdAt field to 'criado_em'
  updatedAt: 'atualizado_em', // Maps the updatedAt field to 'atualizado_em'
  underscored: true // Uses snake_case for automatically added attributes
});

module.exports = Category;