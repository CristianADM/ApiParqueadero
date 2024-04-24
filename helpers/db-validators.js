const { Parqueadero, Usuario, Parqueadero_vehiculo } = require("../models");
const { ESTADOS } = require("./constantes");


//Validar que si existe el correo no permita registrar usuario
const existeEmail = async (correo = "") => {
    const existeCorreoUsuario = await Usuario.findOne({
        where: {correo}
    });

    if(existeCorreoUsuario){
        throw new Error(`El correo ${existeCorreoUsuario.correo}, ya está registrado`);
    }
};

//Validar que si existe el correo no permita registrar usuario
const noExisteEmail = async (correo = "") => {
    const existeCorreoUsuario = await Usuario.findOne({
        where: {correo}
    });

    if(!existeCorreoUsuario){
        throw new Error(`El correo ${correo} no existe.`);
    }
};

//Validar que existe el usuario por id
const noExisteUsuarioPorId = async (id_usuario = "") => {
    const existeUsuario = await Usuario.findOne({
        where: {
            id_usuario,
            estado_activo: ESTADOS.activo.boolean
        }
    });

    if(!existeUsuario){
        throw new Error(`El usuario ingresado no existe`);
    }
};

//Validar que existe parqueadero por id
const noExisteParqueaderoPorId = async (id = "") => {
    const existeParqueadero = await Parqueadero.findOne({
        where: {
            id_parqueadero: id,
            estado_activo: ESTADOS.activo.boolean
        }
    });

    if(!existeParqueadero){
        throw new Error(`No existe parqueadero con ese id`);
    }
};

//Validar que ya existe un vehiculo ingresado
const existeVehiculoRegistrado = async (placa_vehiculo = "") => {
    const existeVehiculo = await Parqueadero_vehiculo.findOne({
        where: {
            placa_vehiculo: placa_vehiculo.toUpperCase(),
            estado_activo: ESTADOS.activo.boolean
        }
    });

    if(existeVehiculo){
        throw new Error(`No se puede Registrar Ingreso, ya existe la placa en este u otro parqueadero`);
    }
};

//Validar que no existe un vehiculo ingresado
const noExisteVehiculoRegistrado = async (placa_vehiculo = "") => {
    const existeVehiculo = await Parqueadero_vehiculo.findOne({
        where: {
            placa_vehiculo: placa_vehiculo.toUpperCase(),
            estado_activo: ESTADOS.activo.boolean
        }
    });

    if(!existeVehiculo){
        throw new Error(`No se puede Registrar Salida, no existe la placa en el parqueadero`);
    }
};

const noExisteVehiculo = async (placa_vehiculo = "") => {
    const existeVehiculo = await Parqueadero_vehiculo.findOne({
        where: {
            placa_vehiculo: placa_vehiculo.toUpperCase()
        }
    });

    if(!existeVehiculo){
        throw new Error(`No existe vehículo registrado con esa placa.`);
    }
};

module.exports = {
    existeEmail,
    noExisteEmail,
    noExisteUsuarioPorId,
    noExisteParqueaderoPorId,
    existeVehiculoRegistrado,
    noExisteVehiculoRegistrado,
    noExisteVehiculo
}