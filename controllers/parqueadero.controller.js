const { response, request } = require('express');
const { Parqueadero, Usuario, Parqueadero_vehiculo } = require('../models');
const { ESTADOS } = require('../helpers/constantes');



const consultarParqueaderos = async (req = request, res = response) => {

    const {limite = 20, desde = 0} = req.query;

    try {
        const parqueaderos = await Parqueadero.findAndCountAll({
            attributes: {
                exclude: ["id_usuario"]
            },
            include: {
                model: Usuario,
                attributes: ["id_usuario","correo", "nombre"]
            },
            offset: Number(desde),
            limit: Number(limite)
        });
    
        res.json({
            parqueaderos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    } 
    
}

const consultarParqueaderosPorIdSocio = async (req = request, res = response) => {

    const {limite = 20, desde = 0} = req.query;

    try {

        const usuario = req.usuario;

        const parqueaderos = await Parqueadero.findAndCountAll({
            where: {
                id_usuario: usuario.id_usuario
            },
            attributes: {
                exclude: ["id_usuario"]
            },
            include: {
                model: Usuario,
                attributes: ["id_usuario","correo", "nombre"]
            },
            offset: Number(desde),
            limit: Number(limite)
        });
    
        res.json({
            parqueaderos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    } 
    
}

const crearParqueadero = async (req = request, res = response) => {
    const { nombre, valor_hora, capacidad_vehiculos, id_usuario } = req.body;

    try {
        const parqueadero = await Parqueadero.create({
            nombre,
            valor_hora,
            capacidad_vehiculos,
            espacios_disponibles: capacidad_vehiculos,
            id_usuario
        });

        res.json({
            parqueadero
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}

const actualizarParqueadero = async (req, res = response) => {
    const {id} = req.params;
    const {nombre, valor_hora, capacidad_vehiculos, id_usuario} = req.body;

    try {

        let cuerpo = {};

        if(nombre) {
            cuerpo.nombre = nombre;
        }

        if(valor_hora) {
            cuerpo.valor_hora = valor_hora;
        }

        if(capacidad_vehiculos) {

            const cantidadVehiculosActivos = await Parqueadero_vehiculo.count({
                where: {
                  id_parqueadero: id,
                  estado_activo: true
                },
              });

            const espacios_disponibles = capacidad_vehiculos - cantidadVehiculosActivos;

            if(espacios_disponibles < 0) {
                return res.status(400).json({
                    mensaje: "La capacidad de vehículos es menor a los vehículos registrados."
                });
            }

            cuerpo.capacidad_vehiculos = capacidad_vehiculos;
            cuerpo.espacios_disponibles = espacios_disponibles;
        }

        if(id_usuario) {
            cuerpo.id_usuario = id_usuario;
        }

        const parqueadero = await Parqueadero.findByPk(id);

        await parqueadero.update(cuerpo);
        res.json({
            parqueadero
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}

const eliminarParqueadero = async (req, res = response) => {
    const {id} = req.params;

    try {
        const parqueadero = await Parqueadero.findByPk(id);
        
        await parqueadero.update({
            estado_activo: ESTADOS.inactivo.boolean
        });

        res.json({
            parqueadero
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}




module.exports = {
    consultarParqueaderos,
    consultarParqueaderosPorIdSocio,
    crearParqueadero,
    actualizarParqueadero,
    eliminarParqueadero
}