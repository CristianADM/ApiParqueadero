const { Router } = require('express');
const { check } = require('express-validator');

const { crearParqueadero, consultarParqueaderos, actualizarParqueadero, eliminarParqueadero, consultarParqueaderosPorIdSocio } = require('../controllers/parqueadero.controller');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const { noExisteUsuarioPorId, noExisteParqueaderoPorId } = require('../helpers/db-validators');
const { tieneRol } = require('../middlewares/validar-roles');

const { ROLES } = require('../helpers/constantes');


const router = Router();


router.get('/', [
    validarJwt,
    tieneRol(ROLES.administrador),
    validarCampos
], consultarParqueaderos );

router.get('/socio', [
    validarJwt,
    tieneRol(ROLES.socio),
    validarCampos
], consultarParqueaderosPorIdSocio );

router.post('/', [
    validarJwt,
    tieneRol(ROLES.administrador),
    check("valor_hora", "El valor_hora no es un valor valido").isFloat({gt: 0}),
    check("capacidad_vehiculos", "La capacidad_vehiculos no es un valor valido").isInt({gt: 0}),
    check("id_usuario").custom(noExisteUsuarioPorId),
    validarCampos
], crearParqueadero);

router.put('/:id', [
    validarJwt,
    tieneRol(ROLES.administrador),
    check("id").custom(noExisteParqueaderoPorId),
    check("valor_hora", "El valor_hora no es un valor valido").optional().isFloat({gt: 0}),
    check("capacidad_vehiculos", "La capacidad_vehiculos no es un valor valido").optional().isInt({gt: 0}),
    check("id_usuario").optional().custom(noExisteUsuarioPorId),
    validarCampos
], actualizarParqueadero);

router.delete('/:id', [
    validarJwt,
    tieneRol(ROLES.administrador),
    check("id").custom(noExisteParqueaderoPorId),
    validarCampos
], eliminarParqueadero);

module.exports = router;