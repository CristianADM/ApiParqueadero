const { Router } = require('express');
const { check } = require('express-validator');

const { login, logout } = require('../controllers/auth.controller');
const { validarCampos, validarRecursos } = require('../middlewares/validar-campos');
const { noExisteEmail } = require('../helpers/db-validators');

const router = Router();

router.post("/login", [
    check("correo", "El correo es obligatorio").isEmail(),
    check("contrasenna", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
    check("correo").custom(noExisteEmail),
    validarRecursos
], login);

router.post("/logout", [
    check("x-token", "El x-token es obligatorio").notEmpty(),
    validarCampos
], logout);

module.exports = router;