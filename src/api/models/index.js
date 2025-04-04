// This file sets up the database connection and defines the relationships between models using Sequelize.

const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

// Import models
const Person = require('./person.model');
const Client = require('./client.model');
const Address = require('./address.model');
const Cart = require('./cart.model');
const Product = require('./product.model');
const CartItem = require('./cartItem.model');
const Category = require('./category.model');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model');
const Payment = require('./payment.model');

const db = {};

// Basic configuration
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Register models
db.Person = Person;
db.Client = Client;
db.Address = Address;
db.Cart = Cart;
db.Product = Product;
db.CartItem = CartItem;
db.Category = Category;
db.Order = Order;
db.OrderItem = OrderItem;
db.Payment = Payment;

// Define relationships between models

// Person-Client (1:1)
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

// Client-Address (1:N)
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

// Client-Cart (1:1)
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

// Product-CartItem (1:N)
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
  onDelete: 'RESTRICT', // Prevents deletion of products with items in carts
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

// Category-Product (N:M)
db.Category.belongsToMany(db.Product, {
  through: 'ProductCategory',
  foreignKey: {
    name: 'id_categoria',
    allowNull: false,
    validate: {
      notNull: { msg: 'ID da categoria é obrigatório' },
      isInt: { msg: 'ID da categoria deve ser um número inteiro' }
    }
  },
  otherKey: 'id_produto',
  as: 'products',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.Product.belongsToMany(db.Category, {
  through: 'ProductCategory',
  foreignKey: {
    name: 'id_produto',
    allowNull: false,
    validate: {
      notNull: { msg: 'ID do produto é obrigatório' },
      isInt: { msg: 'ID do produto deve ser um número inteiro' }
    }
  },
  otherKey: 'id_categoria',
  as: 'categories',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Client-Order (1:N)
db.Client.hasMany(db.Order, {
  foreignKey: {
    name: 'id_cliente',
    allowNull: false,
    validate: {
      notNull: { msg: 'ID do cliente é obrigatório' },
      isInt: { msg: 'ID do cliente deve ser um número inteiro' }
    }
  },
  as: 'orders',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

db.Order.belongsTo(db.Client, {
  foreignKey: {
    name: 'id_cliente',
    allowNull: false,
    validate: {
      notNull: { msg: 'ID do cliente é obrigatório' },
      isInt: { msg: 'ID do cliente deve ser um número inteiro' }
    }
  },
  as: 'client',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Order-OrderItem (1:N)
db.Order.hasMany(db.OrderItem, {
  foreignKey: {
    name: 'id_pedido',
    allowNull: false,
    validate: {
      notNull: { msg: 'ID do pedido é obrigatório' },
      isInt: { msg: 'ID do pedido deve ser um número inteiro' }
    }
  },
  as: 'orderItems',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.OrderItem.belongsTo(db.Order, {
  foreignKey: {
    name: 'id_pedido',
    allowNull: false,
    validate: {
      notNull: { msg: 'ID do pedido é obrigatório' },
      isInt: { msg: 'ID do pedido deve ser um número inteiro' }
    }
  },
  as: 'order',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Order-Payment (1:1)
db.Order.hasOne(db.Payment, {
  foreignKey: {
    name: 'id_pedido',
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'ID do pedido é obrigatório' },
      isInt: { msg: 'ID do pedido deve ser um número inteiro' }
    }
  },
  as: 'payment',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.Payment.belongsTo(db.Order, {
  foreignKey: {
    name: 'id_pedido',
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'ID do pedido é obrigatório' },
      isInt: { msg: 'ID do pedido deve ser um número inteiro' }
    }
  },
  as: 'order',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Product-OrderItem (1:N)
db.Product.hasMany(db.OrderItem, {
  foreignKey: {
    name: 'id_produto',
    allowNull: false,
    validate: {
      notNull: { msg: 'ID do produto é obrigatório' },
      isInt: { msg: 'ID do produto deve ser um número inteiro' }
    }
  },
  as: 'orderItems',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

db.OrderItem.belongsTo(db.Product, {
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

// Synchronize with the database (development only)
if (process.env.NODE_ENV === 'development') {
  db.sequelize.sync({ alter: true })
    .then(() => {
      console.log('🔄 Iniciando sincronização dos models...');
      console.log('✅ Models sincronizados com o banco de dados');
    })
    .catch(err => {
      console.error('❌ Erro ao sincronizar models:', err);
      process.exit(1); // Terminates the application in case of a critical error
    });
}

module.exports = db;
