const express = require('express');
const cors = require('cors');
const db = require('../db/conexion');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        this.parqueaderosPath = '/api/parqueaderos';
        this.parqueaderosVehiculosPath = '/api/parqueaderosVehiculos';
        this.indicadoresPath = '/api/indicadores';
        this.emailApiPath = '/api/emailapi';

        //conexion con la base de datos 
        this.dbConexion();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async dbConexion() {
        try {
            await db.authenticate();
            console.log("Base de datos en linea!");
        } catch(error) {
            throw new Error(error);
        }
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

    }

    routes() {
        this.app.use( this.usuariosPath, require('../routes/usuario.routes'));
        this.app.use( this.authPath, require('../routes/auth.routes'));
        this.app.use( this.parqueaderosPath, require('../routes/parqueadero.routes'));
        this.app.use( this.parqueaderosVehiculosPath, require('../routes/parqueadero_vehiculos.routes'));
        this.app.use( this.indicadoresPath, require('../routes/indicadores.routes'));
        this.app.use( this.emailApiPath, require('../routes/email.routes'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
