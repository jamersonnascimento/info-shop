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
    unique: true, // Ensures that a person can only have one client
    references: {
      model: Person, // References the Person model
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
  tableName: 'client', // Specifies the table name
  timestamps: true, // Enables automatic timestamp fields
  createdAt: 'criado_em', // Maps the createdAt field to 'criado_em'
  updatedAt: 'atualizado_em', // Maps the updatedAt field to 'atualizado_em'
  underscored: true // Uses snake_case for automatically added attributes
});

module.exports = Client;