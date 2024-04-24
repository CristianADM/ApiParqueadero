
const tieneRol = (...roles) => {
    return (req, res, next) => {
        if(!req.usuario) {
            return res.status(500).json({
                mensaje: "Se quiere validar el rol, sin validar el token primero"
            });
        }

        if(!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                mensaje: "No posee autorizacion para este servicio"
            });
        }

        next();
    };
};

module.exports = {
    tieneRol
}