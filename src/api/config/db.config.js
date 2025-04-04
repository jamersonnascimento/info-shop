// This file configures the database connection using Sequelize ORM.
// It reads environment variables to set up the connection for different environments (development and production).

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { Sequelize } = require('sequelize');

// Define required environment variables for each environment
const requiredEnvVars = {
  development: [
    'DB_DEV_USERNAME',
    'DB_DEV_PASSWORD',
    'DB_DEV_DATABASE',
    'DB_DEV_HOST',
    'DB_DEV_PORT'
  ],
  production: [
    'DB_PROD_USERNAME',
    'DB_PROD_PASSWORD',
    'DB_PROD_DATABASE',
    'DB_PROD_HOST',
    'DB_PROD_PORT'
  ]
};

// Determine the current environment (default to development)
const environment = process.env.NODE_ENV || "development";

// Check if all required environment variables are set
for (const envVar of requiredEnvVars[environment]) {
  if (!process.env[envVar]) {
    throw new Error(`Variável de ambiente ${envVar} não definida`);
  }
}

// Database configuration for different environments
const databaseConfig = {
  development: {
    username: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASSWORD,
    database: process.env.DB_DEV_DATABASE,
    host: process.env.DB_DEV_HOST,
    dialect: "postgres",
    port: process.env.DB_DEV_PORT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  },
  production: {
    username: process.env.DB_PROD_USERNAME,
    password: process.env.DB_PROD_PASSWORD,
    database: process.env.DB_PROD_DATABASE,
    host: process.env.DB_PROD_HOST,
    dialect: "postgres",
    port: process.env.DB_PROD_PORT,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
};

// Select the configuration based on the current environment
const config = databaseConfig[environment];

// Initialize Sequelize with the selected configuration
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  port: config.port,
  logging: config.logging,
  pool: config.pool,
  ssl: config.ssl,
  dialectOptions: {
    ...config.dialectOptions,
    timezone: 'America/Sao_Paulo',
    dateStrings: true,
    typeCast: true
  },
  define: {
    freezeTableName: true,
    timestamps: true,
    underscored: true, // Use snake_case for column names
  },
  timezone: 'America/Sao_Paulo'
});

// Function to attempt reconnection in case of failure
const maxRetries = 5;
let retries = 0;

const connectWithRetry = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Conexão com o banco de dados (${environment}) estabelecida com sucesso!`);
  } catch (err) {
    retries++;
    if (retries < maxRetries) {
      console.log(`Tentativa ${retries} de ${maxRetries} falhou. Tentando novamente em 5 segundos...`);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.error("Erro ao conectar ao banco de dados após várias tentativas:", err);
      process.exit(1);
    }
  }
};

// Start the connection with retry logic
connectWithRetry();

module.exports = sequelize;