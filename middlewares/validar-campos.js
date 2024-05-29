const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const mensajesError = errors.array().map(error => {
            return {mensaje: error.msg}
        });
        return res.status(400).json(mensajesError);
    }
    next();
};

const validarRecursos = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const mensajesError = errors.array().map(error => {
            return {mensaje: error.msg}
        });
        return res.status(404).json(mensajesError);
    }
    next();
};

module.exports = {
    validarCampos,
    validarRecursos
}