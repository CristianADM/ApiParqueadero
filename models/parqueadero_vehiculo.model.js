const { DataTypes } = require("sequelize");
const db = require("../db/conexion");

const Parqueadero_vehiculo = db.define("parqueadero_vehiculo", {
        id_parqueadero_vehiculo: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        id_parqueadero: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: "Parqueadero",
                key: "id_parqueadero"
            }
        },
        placa_vehiculo: {
            allowNull: false,
            type: DataTypes.STRING
        },
        fecha_ingreso: {
            allowNull: true,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        fecha_salida: {
            allowNull: true,
            type: DataTypes.DATE
        },
        valor_tiempo: {
            allowNull: true,
            type: DataTypes.DOUBLE
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

module.exports = Parqueadero_vehiculo;