const {request, response} = require("express");

const enviarEmailApiEmail = async (req = request, res = response) => {

    const {email, placa, mensaje, parqueaderoid} = req.body;
    try {
        console.log("Correo enviado con exito!");

        res.json({
            mensaje: "Correo enviado con exito",
            correo: req.body
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Hable con el administrador!"
        });
    }
}

module.exports = {
    enviarEmailApiEmail
}