const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const mensajesError = errors.array().map(error => {
            return {mensaje: error.mensaje}
        });
        return res.status(400).json(mensajesError);
        //return res.status(400).json(errors);
    }
    next();
};

module.exports = {
    validarCampos
}