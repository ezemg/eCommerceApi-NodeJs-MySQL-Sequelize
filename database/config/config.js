module.exports = {
  development: {
    username: 'root',
    password: null,
    database: 'ecommercemodel',
    host: '127.0.0.1',
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: false,
  },
  test: {
    username: 'root',
    password: null,
    database: 'ecommercemodel',
    host: '127.0.0.1',
    dialect: 'mysql',
    port: process.env.DB_PORT,
  },
  production: {
    username: 'root',
    password: null,
    database: 'ecommercemodel',
    host: '127.0.0.1',
    dialect: 'mysql',
    port: process.env.DB_PORT,
  },
};
