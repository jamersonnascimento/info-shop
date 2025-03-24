const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

// Importação dos modelos
const Person = require('./person.model');
const Client = require('./client.model');
const Address = require('./address.model');
const Cart = require('./cart.model');
const Product = require('./product.model');
const CartItem = require('./cartItem.model');

const db = {};

// Configuração básica
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Registro dos modelos
db.Person = Person;
db.Client = Client;
db.Address = Address;
db.Cart = Cart;
db.Product = Product;
db.CartItem = CartItem;

// Relacionamentos Person-Client (1:1)
db.Person.hasOne(db.Client, {
  foreignKey: {
    name: 'id_pessoa',
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'ID da pessoa é obrigatório' },
      isInt: { msg: 'ID da pessoa deve ser um número inteiro' }
    }
  },
  as: 'clientInfo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.Client.belongsTo(db.Person, {
  foreignKey: {
    name: 'id_pessoa',
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'ID da pessoa é obrigatório' },
      isInt: { msg: 'ID da pessoa deve ser um número inteiro' }
    }
  },
  as: 'personInfo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Relacionamentos Client-Address (1:N)
db.Client.hasMany(db.Address, {
  foreignKey: {
    name: 'id_cliente',
    allowNull: false,
    validate: {
      notNull: { msg: 'ID do cliente é obrigatório' },
      isInt: { msg: 'ID do cliente deve ser um número inteiro' }
    }
  },
  as: 'addresses',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.Address.belongsTo(db.Client, {
  foreignKey: {
    name: 'id_cliente',
    allowNull: false,
    validate: {
      notNull: { msg: 'ID do cliente é obrigatório' },
      isInt: { msg: 'ID do cliente deve ser um número inteiro' }
    }
  },
  as: 'clientInfo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Relacionamentos Client-Cart (1:1)
db.Client.hasOne(db.Cart, {
  foreignKey: {
    name: 'id_cliente',
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'ID do cliente é obrigatório' },
      isInt: { msg: 'ID do cliente deve ser um número inteiro' }
    }
  },
  as: 'cart',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.Cart.belongsTo(db.Client, {
  foreignKey: {
    name: 'id_cliente',
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'ID do cliente é obrigatório' },
      isInt: { msg: 'ID do cliente deve ser um número inteiro' }
    }
  },
  as: 'clientInfo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Relacionamentos Product-CartItem (1:N)
db.Product.hasMany(db.CartItem, {
  foreignKey: {
    name: 'id_produto',
    allowNull: false,
    validate: {
      notNull: { msg: 'ID do produto é obrigatório' },
      isInt: { msg: 'ID do produto deve ser um número inteiro' }
    }
  },
  as: 'cartItems',
  onDelete: 'RESTRICT', // Impede deleção de produto com itens em carrinhos
  onUpdate: 'CASCADE'
});

db.CartItem.belongsTo(db.Product, {
  foreignKey: {
    name: 'id_produto',
    allowNull: false,
    validate: {
      notNull: { msg: 'ID do produto é obrigatório' },
      isInt: { msg: 'ID do produto deve ser um número inteiro' }
    }
  },
  as: 'product',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Sincronização com o banco (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  db.sequelize.sync({ alter: true })
    .then(() => {
      console.log('🔄 Iniciando sincronização dos models...');
      console.log('✅ Models sincronizados com o banco de dados');
    })
    .catch(err => {
      console.error('❌ Erro ao sincronizar models:', err);
      process.exit(1); // Encerra a aplicação em caso de erro crítico
    });
}

module.exports = db;