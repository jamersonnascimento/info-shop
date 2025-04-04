// This file defines the Cart model using Sequelize, which represents the 'cart' table in the database.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Client = require('./client.model');

// Define the Cart model
const Cart = sequelize.define('Cart', {
  id_carrinho: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Ensures a 1:1 relationship with the Client
    references: {
      model: Client, // References the Client model
      key: 'id_cliente'
    }
  },
  status: {
    type: DataTypes.ENUM('ativo', 'abandonado', 'finalizado'), // Defines possible statuses for the cart
    allowNull: false,
    defaultValue: 'ativo' // Default status is 'ativo'
  },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Automatically sets the creation date
  }
}, {
  tableName: 'cart', // Specifies the table name
  timestamps: true, // Enables automatic timestamp fields
  createdAt: 'criado_em', // Maps the createdAt field to 'criado_em'
  updatedAt: false, // Disables the updatedAt field
  underscored: true // Uses snake_case for automatically added attributes
});

module.exports = Cart;