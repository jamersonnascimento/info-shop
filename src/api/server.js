require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

// Inicializa o aplicativo Express
const app = express();

// Configurações do CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));

// Apply JSON parsing middleware for all requests except GET and DELETE
app.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'DELETE') {
    return next();
  }
  express.json()(req, res, next);
});

// Ensure all DELETE requests can be processed properly
app.use((req, res, next) => {
  if (req.method === 'DELETE') {
    // For all DELETE requests, ensure body is initialized
    req.body = req.body || {};
  }
  next();
});


app.use(express.urlencoded({ extended: true }));

// Rota inicial para testar a API
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API Computer Shop! 🚀',
    version: '1.0.0',
    status: 'online'
  });
});

// Rotas
require('./routes/client.routes')(app);
require('./routes/person.routes')(app);
require('./routes/address.routes')(app);
require('./routes/cart.routes')(app);
require('./routes/product.routes')(app);
require('./routes/cartItem.routes')(app);
require('./routes/category.routes')(app);
require('./routes/order.routes')(app);
require('./routes/orderItem.routes')(app);

// Configurações
const PORT = process.env.API_PORT || 8080;
const HOST = process.env.API_HOST || 'localhost';

// Sincronização do banco de dados e inicialização do servidor
db.sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log('🎲 Banco de dados sincronizado com sucesso!');
      console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao sincronizar o banco de dados:', err.message);
    process.exit(1);
  });

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Erro não tratado:', err);
  process.exit(1);
});