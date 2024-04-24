const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const { tieneRol } = require('../middlewares/validar-roles');

const { ROLES, RANGO_TIEMPO } = require('../helpers/constantes');
const { consultarLosVechiculosMasRegistrados, 
    consultarLosVechiculosMasRegistradosPorParqueadero, 
    consultarVehiculoPorPlaca, 
    consultarLosVechiculosPrimeraVezPorParqueadero, 
    consultarGananciasParqueadero } = require('../controllers/indicadores.controller');

const router = Router();

router.get('/masregistrados/', [
    validarJwt,
    tieneRol(ROLES.socio, ROLES.administrador),
    validarCampos
], consultarLosVechiculosMasRegistrados);

router.get('/masregistradosPorParqueadero/:id', [
    validarJwt,
    tieneRol(ROLES.socio, ROLES.administrador),
    check("id", "El id del parqueadero es invalido o es menor a 0").isInt({gt: 0}),
    validarCampos
], consultarLosVechiculosMasRegistradosPorParqueadero);

router.get('/vehiculosprimeravez/:id', [
    validarJwt,
    tieneRol(ROLES.socio, ROLES.administrador),
    check("id", "El id del parqueadero es invalido o es menor a 0").isInt({gt: 0}),
    validarCampos
], consultarLosVechiculosPrimeraVezPorParqueadero);

router.get('/ganancias/:id', [
    validarJwt,
    tieneRol(ROLES.socio),
    check("id", "El id del parqueadero es invalido o es menor a 0").isInt({gt: 0}),
    check("rango_tiempo",`El rango de tiempo debe estar entre [${RANGO_TIEMPO.hoy}, ${RANGO_TIEMPO.semana}, ${RANGO_TIEMPO.mes}, ${RANGO_TIEMPO.year}]`).isIn([RANGO_TIEMPO.hoy, RANGO_TIEMPO.semana, RANGO_TIEMPO.mes, RANGO_TIEMPO.year]),
    validarCampos
], consultarGananciasParqueadero);

router.get('/placavehiculo/:placa', [
    validarJwt,
    tieneRol(ROLES.socio, ROLES.administrador),
    check("placa", "La placa del vehículo debe tener entre 1 y 6 caracteres").isLength({min: 1, max: 6}),
    check("placa", "La placa del vehículo tiene caracteres no validos").matches(/^[a-zA-Z0-9]{1,6}$/),
    validarCampos
], consultarVehiculoPorPlaca);

module.exports = router;