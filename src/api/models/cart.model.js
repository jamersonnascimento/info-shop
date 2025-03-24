const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Client = require('./client.model');

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
    unique: true, // Garante relação 1:1
    references: {
      model: Client,
      key: 'id_cliente'
    }
  },
  status: {
    type: DataTypes.ENUM('ativo', 'abandonado', 'finalizado'),
    allowNull: false,
    defaultValue: 'ativo'
  },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cart',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: false, // Não precisamos de updated_at neste caso
  underscored: true
});

module.exports = Cart;