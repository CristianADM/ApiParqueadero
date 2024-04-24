const { DataTypes } = require("sequelize");
const db = require("../db/conexion");

const Sesion = db.define("sesion", {
        id_sesion: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        id_usuario: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        token: {
            allowNull: true,
            type: DataTypes.STRING
        },
        estado_activo: {
            allowNull: true,
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: "fecha_creacion",
        updatedAt: "fecha_modificacion"
    }
);

module.exports = Sesion;