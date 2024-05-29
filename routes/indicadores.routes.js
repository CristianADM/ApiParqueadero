const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarRecursos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const { tieneRol } = require('../middlewares/validar-roles');

const { ROLES, RANGO_TIEMPO } = require('../helpers/constantes');
const { consultarLosVechiculosMasRegistrados, 
    consultarLosVechiculosMasRegistradosPorParqueadero, 
    consultarVehiculoPorPlaca, 
    consultarLosVechiculosPrimeraVezPorParqueadero, 
    consultarGananciasParqueadero } = require('../controllers/indicadores.controller');
const { noExisteParqueaderoPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/vehivulos-mas-registrados', [
    validarJwt,
    tieneRol(ROLES.socio, ROLES.administrador),
    validarCampos
], consultarLosVechiculosMasRegistrados);

router.get('/vehiculos-mas-registrados-por-parqueadero/:id', [
    validarJwt,
    tieneRol(ROLES.socio, ROLES.administrador),
    check("id", "El id del parqueadero es invalido o es menor a 0").isInt({gt: 0}),
    validarCampos,
    check("id").custom(noExisteParqueaderoPorId),
    validarRecursos
], consultarLosVechiculosMasRegistradosPorParqueadero);

router.get('/vehiculos-primera-vez/:id', [
    validarJwt,
    tieneRol(ROLES.socio, ROLES.administrador),
    check("id", "El id del parqueadero es invalido o es menor a 0").isInt({gt: 0}),
    validarCampos,
    check("id").custom(noExisteParqueaderoPorId),
    validarRecursos
], consultarLosVechiculosPrimeraVezPorParqueadero);

router.get('/ganancias/:id', [
    validarJwt,
    tieneRol(ROLES.socio),
    check("id", "El id del parqueadero es invalido o es menor a 0").isInt({gt: 0}),
    check("rango_tiempo",`El rango de tiempo debe estar entre [${RANGO_TIEMPO.hoy}, ${RANGO_TIEMPO.semana}, ${RANGO_TIEMPO.mes}, ${RANGO_TIEMPO.año}]`).isIn([RANGO_TIEMPO.hoy, RANGO_TIEMPO.semana, RANGO_TIEMPO.mes, RANGO_TIEMPO.año]),
    validarCampos,
    check("id").custom(noExisteParqueaderoPorId),
    validarRecursos
], consultarGananciasParqueadero);

router.get('/vehiculo-por-placa/:placa', [
    validarJwt,
    tieneRol(ROLES.socio, ROLES.administrador),
    check("placa", "La placa del vehículo debe tener entre 1 y 6 caracteres").isLength({min: 1, max: 6}),
    check("placa", "La placa del vehículo tiene caracteres no validos").matches(/^[a-zA-Z0-9]{1,6}$/),
    validarCampos
], consultarVehiculoPorPlaca);

module.exports = router;