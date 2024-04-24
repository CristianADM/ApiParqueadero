const Parqueadero = require("./parqueadero.model");
const Parqueadero_vehiculo = require("./parqueadero_vehiculo.model");
const Usuario = require("./usuario.model");
const Sesion = require("./sesion.model");

//-------------\\ Parqueadero //-------------\\
Usuario.hasMany(Parqueadero, {
    foreignKey: "id_usuario"
});
Parqueadero.belongsTo(Usuario, {
    foreignKey: "id_usuario"
});

Parqueadero.hasMany(Parqueadero_vehiculo, {
    foreignKey: "id_parqueadero"
});
Parqueadero_vehiculo.belongsTo(Parqueadero, {
    foreignKey: "id_parqueadero"
});

module.exports = {
    Usuario,
    Parqueadero,
    Parqueadero_vehiculo,
    Sesion
}