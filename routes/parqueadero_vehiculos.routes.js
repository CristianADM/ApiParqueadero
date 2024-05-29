const { Router } = require('express');
const { check } = require('express-validator');

const { consultarParqueaderos } = require('../controllers/parqueadero.controller');

const { validarCampos, validarRecursos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const { noExisteParqueaderoPorId, existeVehiculoRegistrado, noExisteVehiculoRegistrado, noExisteEmail, noExisteVehiculo, noExisteParqueaderoPorNombre } = require('../helpers/db-validators');
const { tieneRol } = require('../middlewares/validar-roles');

const { ROLES, ESTADOS } = require('../helpers/constantes');
const { consultarVechiculosPorParqueadero, ingresarVehiculo, salidaVehiculoParqueadero, enviarCorreo } = require('../controllers/parqueadero_vehiculos.controller');

const router = Router();

router.get('/listado-vehiculos-por-parqueaderos/:id', [
    validarJwt,
    tieneRol(ROLES.socio, ROLES.administrador),
    check("estado_activo",).optional().isString(),
    check("estado_activo",).optional().isIn([ESTADOS.activo.string, ESTADOS.inactivo.string]),
    validarCampos,
    check("id").custom(noExisteParqueaderoPorId),
    validarRecursos
], consultarVechiculosPorParqueadero);

router.post('/', [
    validarJwt,
    tieneRol(ROLES.socio),
    check("placa_vehiculo", "La placa del vehículo no es valida").matches(/^[a-zA-Z0-9]{6}$/),
    validarCampos,
    check("id_parqueadero").custom(noExisteParqueaderoPorId),
    check("placa_vehiculo").custom(existeVehiculoRegistrado),
    validarRecursos
], ingresarVehiculo);

router.post('/enviar-correo', [
    validarJwt,
    tieneRol(ROLES.administrador),
    check("email", "El email es obligatorio").isEmail(),
    check("placa", "La placa no es valida").matches(/^[a-zA-Z0-9]{6}$/),
    check("mensaje", "El mensaje no puede ser vacio").notEmpty(),
    check("parqueadero_nombre", "El nombre no puede ser vacío").notEmpty(),
    validarCampos,
    check("email").custom(noExisteEmail),
    check("placa").custom(noExisteVehiculo),
    check("parqueadero_nombre").custom(noExisteParqueaderoPorNombre),
    validarRecursos
], enviarCorreo);

router.put('/salida/', [
    validarJwt,
    tieneRol(ROLES.socio),
    check("placa_vehiculo", "La placa del vehículo no es valida").matches(/^[a-zA-Z0-9]{6}$/),
    validarCampos,
    check("id_parqueadero").custom(noExisteParqueaderoPorId),
    check("placa_vehiculo").custom(noExisteVehiculoRegistrado),
    validarRecursos
], salidaVehiculoParqueadero);

module.exports = router;