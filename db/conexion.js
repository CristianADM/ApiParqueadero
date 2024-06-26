const {Sequelize} = require("sequelize"); 

const db = new Sequelize(process.env.NOMBRE_ESQUEMA, process.env.USUARIO, process.env.CONTRASENNA, {
    host: process.env.HOST,
    dialect: "mysql",
    timezone: "-05:00"
});

module.exports = db;