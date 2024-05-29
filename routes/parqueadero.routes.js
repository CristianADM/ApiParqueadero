const { Router } = require('express');
const { check } = require('express-validator');

const { crearParqueadero, consultarParqueaderos, actualizarParqueadero, eliminarParqueadero, consultarParqueaderosPorIdSocio } = require('../controllers/parqueadero.controller');

const { validarCampos, validarRecursos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const { noExisteUsuarioPorId, noExisteParqueaderoPorId, existeParqueaderoPorNombre } = require('../helpers/db-validators');
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
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("nombre", "El nombre debe tener maximo 100 caracteres").isLength({max:100}),
    check("valor_hora", "El valor_hora no es un valor valido").isFloat({gt: 0}),
    check("capacidad_vehiculos", "La capacidad_vehiculos no es un valor valido").isInt({gt: 0}),
    validarCampos,
    check("nombre").custom(existeParqueaderoPorNombre),
    check("id_usuario").custom(noExisteUsuarioPorId),
    validarRecursos
], crearParqueadero);

router.put('/:id', [
    validarJwt,
    tieneRol(ROLES.administrador),
    check("nombre", "El nombre debe tener maximo 100 caracteres").optional().isLength({max:100}),
    check("nombre").optional().custom(existeParqueaderoPorNombre),
    check("valor_hora", "El valor_hora no es un valor valido").optional().isFloat({gt: 0}),
    check("capacidad_vehiculos", "La capacidad_vehiculos no es un valor valido").optional().isInt({gt: 0}),
    validarCampos,
    check("id").custom(noExisteParqueaderoPorId),
    check("id_usuario").optional().custom(noExisteUsuarioPorId),
    validarRecursos
], actualizarParqueadero);

router.delete('/:id', [
    validarJwt,
    tieneRol(ROLES.administrador),
    validarCampos,
    check("id").custom(noExisteParqueaderoPorId),
    validarRecursos
], eliminarParqueadero);

module.exports = router;