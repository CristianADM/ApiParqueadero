const { response, request } = require('express');
const { Parqueadero_vehiculo, Parqueadero } = require('../models');
const { Sequelize, Op, QueryTypes } = require('sequelize');
const db = require('../db/conexion');
const { ESTADOS, RANGO_TIEMPO } = require('../helpers/constantes');

const consultarLosVechiculosMasRegistrados = async (req = request, res = response) => {
    try {
        const vehiculos = await Parqueadero_vehiculo.findAll({
            attributes: [[Sequelize.fn('COUNT', 'placa_vehiculo'), 'total_ingresos'], "placa_vehiculo"],
            group: ['placa_vehiculo'],
            order: [[Sequelize.literal('total_ingresos'), 'DESC']],
            limit: 10,
        });

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

const consultarLosVechiculosMasRegistradosPorParqueadero = async (req = request, res = response) => {
    const {id} = req.params;
    try {
        const vehiculos = await Parqueadero_vehiculo.findAll({
            attributes: [[Sequelize.fn('COUNT', 'placa_vehiculo'), 'total_ingresos'], "placa_vehiculo"],
            where: {
                id_parqueadero: id
            },
            group: ['placa_vehiculo'],
            order: [[Sequelize.literal('total_ingresos'), 'DESC']],
            limit: 10,
        });

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

const consultarLosVechiculosPrimeraVezPorParqueadero = async (req = request, res = response) => {
    const {id} = req.params;
    try {
        const vehiculos = await db.query(`SELECT * FROM parqueadero_vehiculo pv
        WHERE pv.placa_vehiculo in (SELECT pv.placa_vehiculo
        FROM parqueadero_vehiculo pv 
        GROUP BY pv.placa_vehiculo 
        HAVING COUNT(pv.placa_vehiculo) = 1)
        and pv.estado_activo = 1 
        and pv.id_parqueadero = ${id}`,
        {
            type: QueryTypes.SELECT
        });

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

const consultarVehiculoPorPlaca = async (req = request, res = response) => {
    const {placa} = req.params;
    try {
        const vehiculos = await Parqueadero_vehiculo.findAll({
            where: {
                placa_vehiculo: {
                    [Op.substring]: placa
                }
            }
        });

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

const consultarGananciasParqueadero = async (req = request, res = response) => {
    const {id} = req.params;
    const {rango_tiempo} = req.query;
    try {

        const usuario = req.usuario;

        const parqueadero = await Parqueadero.findByPk(id);

        if(usuario.id_usuario != parqueadero.id_usuario) {
            return res.status(401).json({
                mensaje: "No tiene acceso a este parqueadero."
            });
        }

        let donde = {
            estado_activo: ESTADOS.inactivo.boolean,
            id_parqueadero: id,
        };

        // Obtener la fecha de hoy
        const fechaHoy = new Date();

        if(rango_tiempo == RANGO_TIEMPO.hoy) {
            const inicioDiaHoy = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate(), 0, 0, 0); // Inicio del día de hoy
            const finDiaHoy = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate(), 23, 59, 59); // Fin del día de hoy

            donde.fecha_creacion = {
                [Op.between]: [inicioDiaHoy, finDiaHoy]
            }

        } else if(rango_tiempo == RANGO_TIEMPO.semana) {
            //inicioSemanaActual.setDate(inicioSemanaActual.getDate() - inicioSemanaActual.getDay()); // Inicio de la semana (domingo)
            let inicioSemana = new Date();
            inicioSemana.setDate(inicioSemana.getDate() - 6);
            console.log("Desde donde arranca: ", inicioSemana);
            
            const finDiaHoy = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate(), 23, 59, 59); // Fin del día de hoy
            console.log("Donde termina: ", finDiaHoy);

            donde.fecha_creacion = {
                [Op.between]: [inicioSemana, finDiaHoy]
            };

        } else if(rango_tiempo == RANGO_TIEMPO.mes) {
            const inicioMesActual = new Date();
            // Primer día del mes actual
            inicioMesActual.setDate(1); 
            const finMesActual = new Date(inicioMesActual);
            // Primer día del próximo mes
            finMesActual.setMonth(finMesActual.getMonth() + 1); 

            donde.fecha_creacion = {
                [Op.between]: [inicioMesActual, finMesActual]
            };

        } else if(rango_tiempo == RANGO_TIEMPO.year) {
            // Primer día del año actual
            const inicioAñoActual = new Date(new Date().getFullYear(), 0, 1); 
            
            // Último día del año actual
            const finAñoActual = new Date(new Date().getFullYear() + 1, 0, 0); 

            donde.fecha_creacion = {
                [Op.between]: [inicioAñoActual, finAñoActual]
            };
        }
        
        const vehiculos = await Parqueadero_vehiculo.findAll({
            where: donde
        });

        let ganancias = 0;
        
        vehiculos.forEach((v) => ganancias = ganancias + v.dataValues.valor_tiempo);

        res.json({
            ganancias
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}

module.exports = {
    consultarLosVechiculosMasRegistrados,
    consultarLosVechiculosMasRegistradosPorParqueadero,
    consultarLosVechiculosPrimeraVezPorParqueadero,
    consultarVehiculoPorPlaca,
    consultarGananciasParqueadero
    
}