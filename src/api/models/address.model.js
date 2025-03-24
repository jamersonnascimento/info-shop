const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Address = sequelize.define('Address', {
  id_endereco: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'client',
      key: 'id_cliente'
    }
  },
  rua: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O nome da rua é obrigatório'
      },
      len: {
        args: [2, 150],
        msg: 'O nome da rua deve ter entre 2 e 150 caracteres'
      }
    }
  },
  numero: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O número é obrigatório'
      }
    }
  },
  bairro: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O bairro é obrigatório'
      },
      len: {
        args: [2, 100],
        msg: 'O nome do bairro deve ter entre 2 e 100 caracteres'
      }
    }
  },
  cidade: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A cidade é obrigatória'
      },
      len: {
        args: [2, 100],
        msg: 'O nome da cidade deve ter entre 2 e 100 caracteres'
      }
    }
  },
  estado: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O estado é obrigatório'
      },
      len: {
        args: [2, 2],
        msg: 'O estado deve ter exatamente 2 caracteres'
      },
      isUppercase: {
        msg: 'O estado deve estar em maiúsculas'
      }
    }
  },
  cep: {
    type: DataTypes.CHAR(8),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O CEP é obrigatório'
      },
      len: {
        args: [8, 8],
        msg: 'O CEP deve ter exatamente 8 dígitos'
      },
      isNumeric: {
        msg: 'O CEP deve conter apenas números'
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
  tableName: 'address',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
  underscored: true
});

module.exports = Address;