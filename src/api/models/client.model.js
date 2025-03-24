// Importação dos módulos
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Person = require('./person.model');

// Definição do modelo Client
const Client = sequelize.define('Client', {
  id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_pessoa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Garante que uma pessoa só pode ter um cliente
    references: {
      model: Person,
      key: 'id_pessoa'
    }
  },
  senha_hash: {
    type: DataTypes.TEXT,
    allowNull: false
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
  tableName: 'client',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
  underscored: true
});

module.exports = Client;