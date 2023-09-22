const express = require('express');
const cors = require('cors');
const db = require('../database/models');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      address: '/api/address',
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      roles: '/api/roles',
      search: '/api/search',
      shopping: '/api/shopping',
      uploads: '/api/uploads',
      users: '/api/users',
    };

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
    this.app.use(this.paths.users, require('../routes/usersRoutes.js'));

    this.app.use(this.paths.address, require('../routes/addressRoutes.js'));

    this.app.use(this.paths.roles, require('../routes/rolesRoutes.js'));

    this.app.use(this.paths.auth, require('../routes/authRoutes.js'));
    this.app.use(
      this.paths.categories,
      require('../routes/categoriesRoutes.js')
    );
    this.app.use(this.paths.products, require('../routes/productsRoutes.js'));
    this.app.use(this.paths.search, require('../routes/searchRoutes.js'));
    this.app.use(this.paths.shopping, require('../routes/shoppingRoutes.js'));
    this.app.use(this.paths.uploads, require('../routes/uploadsRoutes.js'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto', this.port);
    });
  }
}

module.exports = Server;
