const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");
const { Sesion } = require("../models");
const { ESTADOS } = require("../helpers/constantes");

const validarJwt = async (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).json({
            mensaje: "No hay token en la petición"
        });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {

        const {uid} = jwt.verify(token, process.env.SECRETKEY);

        const usuario = await Usuario.findByPk(uid);

        if(!usuario) {
            return res.status(401).json({
                mensaje: "Token no valido - no encontramos el usuario"
            });
        }

        //verificar que el usuario esta activo
        if(!usuario.estado_activo) {
            return res.status(401).json({
                mensaje: "Token no valido - usuario no esta activo"
            });
        }

        const sesion = await Sesion.findOne({
            where: {
                token,
                estado_activo: ESTADOS.activo.boolean
            }
        });

        if(!sesion) {
            return res.status(401).json({
                mensaje: "Token no valido - sesion invalida"
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            mensaje: "Token no válido - error"
        });
    }
};

module.exports = {
    validarJwt
}