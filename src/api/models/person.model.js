const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const moment = require('moment');

const Person = sequelize.define('Person', {
  id_pessoa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  cpf: {
    type: DataTypes.CHAR(11),
    allowNull: false,
    unique: true,
    validate: {
      len: [11, 11],
      is: /^\d{11}$/,
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  telefone: {
    type: DataTypes.STRING(15),
    allowNull: true,
    validate: {
      is: /^(\+?\d{1,3}[-.]?)?\(?(\d{2})\)?[-.]?(\d{4,5})[-.]?(\d{4})$/
    }
  },
  data_nasc: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: {
        args: new Date().toISOString(),
        msg: 'A data de nascimento não pode ser futura'
      },
      isAfter: {
        args: '1900-01-01',
        msg: 'A data de nascimento deve ser posterior a 01/01/1900'
      },
      customValidator(value) {
        if (!moment(value, ['YYYY-MM-DD', 'DD/MM/YYYY'], true).isValid()) {
          throw new Error('Use o formato DD/MM/YYYY ou YYYY-MM-DD');
        }
      }
    },
    get() {
      const rawValue = this.getDataValue('data_nasc');
      return rawValue ? moment(rawValue).format('YYYY-MM-DD') : null;
    },
    set(value) {
      let formattedDate;
      
      if (moment(value, 'DD/MM/YYYY', true).isValid()) {
        formattedDate = moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD');
      } else if (moment(value, 'YYYY-MM-DD', true).isValid()) {
        formattedDate = value;
      } else {
        throw new Error('Formato de data inválido. Use DD/MM/YYYY ou YYYY-MM-DD');
      }
      
      this.setDataValue('data_nasc', formattedDate);
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
  tableName: 'person',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
  underscored: true
});

module.exports = Person;