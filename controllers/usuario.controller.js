const { response, request } = require('express');
const bcryptjs = require("bcryptjs");
const { Usuario } = require('../models');
const { ROLES } = require('../helpers/constantes');

const crearUsuario = async (req = request, res = response) => {
    const { correo, nombre } = req.body;
    const pwd = req.body.contrasenna;

    try {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        const passwordEncriptada = bcryptjs.hashSync(pwd.trim(), salt);

        const usuario = await Usuario.create({
            correo: correo.trim(),
            contrasenna: passwordEncriptada,
            nombre: nombre.trim()
        });

        const {contrasenna, ...usuarioSinContrasena} = usuario.dataValues;

        res.json({
            usuarioSinContrasena
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}

const actualizarUsuario = async (req, res = response) => {
    const {correoUsuarioRegistrado} = req.params;
    const {correo, contrasenna, nombre} = req.body;

    try {
        const usuarioLogueado = req.usuario;

        if(correoUsuarioRegistrado != usuarioLogueado.correo && usuarioLogueado.rol == ROLES.socio){
            return res.status(400).json({
                mensaje: "No tiene acceso a este servicio"
            });
        }

        const usuario = await Usuario.findOne({
            where: {
                correo: correoUsuarioRegistrado
            }
        });
        if(!usuario){
            return res.status(400).json({
                mensaje: "No existe un usuario con ese correo: " + correoUsuarioRegistrado
            });
        }

        let body = { };
        
        if(correo){
            body.correo = correo;
        }

        if(contrasenna) {
            //Encriptar la contraseña
            const salt = bcryptjs.genSaltSync();
            const passwordEncriptada = bcryptjs.hashSync(contrasenna.trim(), salt);
            body.contrasenna = passwordEncriptada;
        }

        if(nombre){
            body.nombre = nombre;
        }

        await usuario.update(body);

        res.json({
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}

const eliminarUsuario = async (req, res = response) => {
    const {id} = req.params;

    try {
        const usuario = await Usuario.findByPk(id);
        if(!usuario){
            return res.status(400).json({
                mensaje: "No existe un usuario con ese id: " + id
            });
        }

        await usuario.update({
            estado_activo: false
        });

        res.json({
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}




module.exports = {
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
}