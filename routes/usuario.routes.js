const { Router } = require('express');
const { check } = require('express-validator');

const { crearUsuario,
        eliminarUsuario,
        actualizarUsuario} = require('../controllers/usuario.controller');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');

const { existeEmail } = require('../helpers/db-validators');
const { tieneRol } = require('../middlewares/validar-roles');
const { ROLES } = require('../helpers/constantes');

const router = Router();

router.post('/', [
    validarJwt,
    tieneRol(ROLES.administrador),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(existeEmail),
    check("contrasenna", "La contraseña debe ser de mas de 4 letras y menos de 20").isLength({min: 4, max: 20}),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos
],crearUsuario);

router.put('/:correoUsuarioRegistrado', [
    validarJwt,
    tieneRol(ROLES.administrador, ROLES.socio),
    check("correoUsuarioRegistrado", "El correo no es válido").isEmail(),
    check("correo", "El correo no es válido").optional().isEmail(),
    validarCampos
], actualizarUsuario);

router.delete('/:id', [
    validarJwt,
    tieneRol(ROLES.administrador),
    validarCampos
], eliminarUsuario );

module.exports = router;