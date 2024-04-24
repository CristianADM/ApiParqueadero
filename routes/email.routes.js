const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { enviarEmailApiEmail } = require('../controllers/email.controller');

const router = Router();

router.post("/", [
    check("email", "El email es obligatorio").isEmail(),
    check("placa", "La placa no es valida").matches(/^[a-zA-Z0-9]{6}$/),
    check("mensaje", "El mensaje no puede ser vacio").notEmpty(),
    validarCampos
], enviarEmailApiEmail);

module.exports = router;