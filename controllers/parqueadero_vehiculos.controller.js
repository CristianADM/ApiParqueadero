const { response, request } = require('express');
const axios = require('axios');

const { Parqueadero, Parqueadero_vehiculo } = require('../models');
const { ESTADOS, ROLES } = require('../helpers/constantes');

const consultarVechiculosPorParqueadero = async (req = request, res = response) => {

    const {id} = req.params;
    const {limite = 20, desde = 0, estado_activo} = req.query;

    try {
        let busquedas = {
            id_parqueadero: id
        };

        if(estado_activo) {
            if(estado_activo == "activo"){
                busquedas.estado_activo = true;
            } else {
                busquedas.estado_activo = false;
            }
            
        }

        const usuario = req.usuario;

        let vehiculos = null;

        if(usuario.rol == ROLES.administrador){
            vehiculos = await Parqueadero_vehiculo.findAndCountAll({
                attributes: {
                    exclude: ["id_parqueadero", "fecha_creacion", "fecha_modificacion"]
                },
                where: busquedas,
                order: [["estado_activo", "DESC"]],
                include: {
                    model: Parqueadero
                },
                offset: Number(desde),
                limit: Number(limite)
            });
        } else {
            vehiculos = await Parqueadero_vehiculo.findAndCountAll({
                where: busquedas,
                order: [["estado_activo", "DESC"]],
                include: {
                    model: Parqueadero,
                    where: {
                        id_usuario: usuario.id_usuario
                    }
                },
                offset: Number(desde),
                limit: Number(limite)
            });
        }
    
        res.json({
            vehiculos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    } 
    
}

const ingresarVehiculo = async (req = request, res = response) => {
    const { id_parqueadero, placa_vehiculo } = req.body;

    try {
        const usuario = req.usuario;

        const parqueadero = await Parqueadero.findByPk(id_parqueadero);

        if(usuario.id_usuario != parqueadero.id_usuario) {
            return res.status(401).json({
                mensaje: "No tiene acceso a este parqueadero."
            });
        }

        if(parqueadero.espacios_disponibles == 0) {
            return res.status(400).json({
                mensaje: "No hay espacios en el parqueadero."
            });
        } 
        
        await parqueadero.update({
            espacios_disponibles: --parqueadero.espacios_disponibles
        });

        const parqueaderoVehiculo = await Parqueadero_vehiculo.create({
            id_parqueadero,
            placa_vehiculo: placa_vehiculo.toUpperCase(),
        });

        await parqueaderoVehiculo.reload();

        res.status(201).json({
            "id": parqueaderoVehiculo.id_parqueadero_vehiculo
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}

const salidaVehiculoParqueadero = async (req, res = response) => {
    
    const {id_parqueadero, placa_vehiculo} = req.body;

    try {
        const usuario = req.usuario;

        const parqueadero = await Parqueadero.findByPk(id_parqueadero);
        
        if(usuario.id_usuario != parqueadero.id_usuario) {
            return res.status(401).json({
                mensaje: "No tiene acceso a este parqueadero."
            });
        }
        
        const parqueaderoVehiculo = await Parqueadero_vehiculo.findOne({
            where: {
                id_parqueadero,
                placa_vehiculo,
                estado_activo: ESTADOS.activo.boolean
            },
            include: {
                model: Parqueadero,

            }
        });

        if(!parqueaderoVehiculo){
            return res.status(400).json({
                mensaje: "No se puede Registrar Salida, no existe la placa en el parqueadero"
            });
        }

        const fecha_salida = new Date();
        const horaParqueado = (fecha_salida - parqueaderoVehiculo.fecha_ingreso) / (1000 * 3600);

        const valorTiempo = horaParqueado * parqueaderoVehiculo.parqueadero.valor_hora;

        
        await parqueadero.update({
            espacios_disponibles: ++parqueadero.espacios_disponibles
        });

        await parqueaderoVehiculo.update({
            fecha_salida,
            valor_tiempo: valorTiempo,
            estado_activo: ESTADOS.inactivo.boolean
        });

        res.status(200).json({
            mensaje: "Salida registrada"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}

const enviarCorreo = async (req = request, res = response) => {

    const {email, placa, mensaje, parqueaderoid} = req.body;
    try {

        const parqueadero_vehiculo = await Parqueadero_vehiculo.findOne({
            where: {
                id_parqueadero: parqueaderoid,
                placa_vehiculo: placa
            }
        });

        if(!parqueadero_vehiculo) {
            return res.status(400).json({
                mensaje: "La placa ingresada no se encuentra en el parqueadero."
            });
        }

    } catch (error) {
        console.log(error);
                res.status(500).json({
                    mensaje: "Hable con el administrador!"
                });
    }

        // URL del endpoint al que deseas enviar la solicitud POST
        const apiUrl = 'http://localhost:8000/api/emailapi/';

        // Datos que deseas enviar en el cuerpo de la solicitud
        const postData = {
            email,
            placa,
            mensaje,
            parqueaderoid
        };

        
        try {
            // Realizar una solicitud POST con los datos proporcionados
            const response = await axios.post(apiUrl, postData);

            console.log(response.data);
            
            // Manejar la respuesta de la API aquí
            return res.json({
                mensaje: response.data.mensaje // Accede a los datos de la respuesta
            });
        } catch (error) {
            // Manejar errores aquí
            console.error(error);
            return res.status(500).json({
                mensaje: "Con error",
                error: error.message // Accede al mensaje de error
            });
        }
}




module.exports = {
    consultarVechiculosPorParqueadero,
    ingresarVehiculo,
    salidaVehiculoParqueadero,
    enviarCorreo
}