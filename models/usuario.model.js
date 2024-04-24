const { DataTypes } = require("sequelize");
const db = require("../db/conexion");

const Usuario = db.define("usuario", {
        id_usuario: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        correo: {
            allowNull: false,
            type: DataTypes.STRING
        },
        contrasenna: {
            allowNull: false,
            type: DataTypes.STRING
        },
        nombre: {
            allowNull: false,
            type: DataTypes.STRING
        },
        rol: {
            allowNull: true,
            type: DataTypes.STRING
        },
        estado_activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: "fecha_creacion",
        updatedAt: "fecha_modificacion"
    }
);

module.exports = Usuario;