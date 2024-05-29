const { DataTypes } = require("sequelize");
const db = require("../db/conexion");

const Parqueadero = db.define("parqueadero", {
        id_parqueadero: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            allowNull: false,
            type: DataTypes.STRING
        },
        valor_hora: {
            allowNull: false,
            type: DataTypes.DOUBLE
        },
        capacidad_vehiculos: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        espacios_disponibles: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_usuario: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: "Usuario",
                key: "id_usuario"
            }
        },
        estado_activo: {
            allowNull: true,
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: "fecha_creacion",
        updatedAt: "fecha_modificacion"
    }
);

module.exports = Parqueadero;