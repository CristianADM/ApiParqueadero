const {request, response} = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario.model");
const { generarJwt } = require("../helpers/generar_jwt");
const { ESTADOS } = require("../helpers/constantes");
const { Sesion } = require("../models");

const login = async (req = request, res = response) => {

    try {

        const {correo, contrasenna} = req.body;

        const usuario = await Usuario.findOne({
            where: {
                correo,
                estado_activo: ESTADOS.activo.boolean
            }
        });

        if(!usuario) {
            return res.status(400).json({
                mensaje: "correo / contraseña son invalidos."
            });
        }

        //Verificar la contraseña
        const validarContrasenna = bcryptjs.compareSync(contrasenna, usuario.contrasenna);
        if(!validarContrasenna) {
            return res.status(400).json({
                mensaje: "correo / contraseña son invalidos."
            });
        }

        const sesion = await Sesion.findOne({
            where: {
                id_usuario: usuario.id_usuario,
                estado_activo: ESTADOS.activo.boolean
            }
        });

        if(sesion) {
            sesion.update({
                estado_activo: ESTADOS.inactivo.boolean
            });
        }

        //Generar un jwt
        const token = await generarJwt(usuario.id_usuario);

        await Sesion.create({
            id_usuario: usuario.id_usuario,
            token
        });

        res.json({
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}

const logout = async (req = request, res = response) => {

    try {

        const token = req.header('x-token');

        console.log(token);

        const sesion = await Sesion.findOne({
            where: {
                token
            }
        });

        console.log(sesion);

        if(sesion){

            console.log(sesion);

            //Invalidamos la sesion si encuentra una activa
            await sesion.update({
                estado_activo: ESTADOS.inactivo.boolean
            });
        }

        res.json({
            mensaje: "Sesion inactivada"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}

module.exports = {
    login,
    logout
}