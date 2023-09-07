const express = require('express');
const cors = require('cors');
const db = require('../database/models');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = '/api/usuarios';
    this.addressPath = '/api/address';

    // DB connection
    this.dbConnection();

    // Middlewares
    this.middlewares();

    // Rutas
    this.routes();
  }

  // DB connection
  async dbConnection() {
    try {
      await db.sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Directorio public
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.usuariosPath, require('../routes/usuariosRoutes.js'));

    this.app.use(this.addressPath, require('../routes/addressRoutes.js'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto', this.port);
    });
  }
}

module.exports = Server;
