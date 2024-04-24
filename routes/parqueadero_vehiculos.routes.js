const { Router } = require('express');
const { check } = require('express-validator');

const { consultarParqueaderos } = require('../controllers/parqueadero.controller');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const { noExisteParqueaderoPorId, existeVehiculoRegistrado, noExisteVehiculoRegistrado } = require('../helpers/db-validators');
const { tieneRol } = require('../middlewares/validar-roles');

const { ROLES, ESTADOS } = require('../helpers/constantes');
const { consultarVechiculosPorParqueadero, ingresarVehiculo, salidaVehiculoParqueadero, enviarCorreo } = require('../controllers/parqueadero_vehiculos.controller');


const router = Router();


/*router.get('/ListadoParqueaderos/', [
    validarJwt,
    tieneRol(ROLES.socio),
    validarCampos
], consultarParqueaderos );*/

router.get('/ListadoVehiculosPorParqueaderos/:id', [
    validarJwt,
    tieneRol(ROLES.socio, ROLES.administrador),
    check("id").custom(noExisteParqueaderoPorId),
    check("estado_activo",).optional().isString(),
    check("estado_activo",).optional().isIn([ESTADOS.activo.string, ESTADOS.inactivo.string]),
    validarCampos
], consultarVechiculosPorParqueadero);

router.post('/', [
    validarJwt,
    tieneRol(ROLES.socio),
    check("id_parqueadero").custom(noExisteParqueaderoPorId),
    check("placa_vehiculo", "La placa del vehículo no es valida").matches(/^[a-zA-Z0-9]{6}$/),
    check("placa_vehiculo").custom(existeVehiculoRegistrado),
    validarCampos
], ingresarVehiculo);

router.post('/enviarCorreo', [
    validarJwt,
    tieneRol(ROLES.administrador),
    check("email", "El email es obligatorio").isEmail(),
    check("placa", "La placa no es valida").matches(/^[a-zA-Z0-9]{6}$/),
    check("placa").custom,
    check("mensaje", "El mensaje no puede ser vacio").notEmpty(),
    check("parqueaderoid").custom(noExisteParqueaderoPorId),
    validarCampos
], enviarCorreo);

router.put('/salida/', [
    validarJwt,
    tieneRol(ROLES.socio),
    check("id_parqueadero").custom(noExisteParqueaderoPorId),
    check("placa_vehiculo", "La placa del vehículo no es valida").matches(/^[a-zA-Z0-9]{6}$/),
    check("placa_vehiculo").custom(noExisteVehiculoRegistrado),
    validarCampos
], salidaVehiculoParqueadero);

module.exports = router;