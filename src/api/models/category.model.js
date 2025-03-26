const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

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
  tableName: 'category',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
  underscored: true
});

module.exports = Category;