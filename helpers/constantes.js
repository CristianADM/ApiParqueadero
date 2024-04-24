const ESTADOS = {
    activo: {
        string: "activo",
        boolean: true
    },
    inactivo: {
        string: "inactivo",
        boolean: false
    }
}

const ROLES = {
    administrador: "ADMIN_ROL",
    socio: "SOCIO_ROL"
}

const RANGO_TIEMPO = {
    hoy: "hoy",
    semana: "semana",
    mes: "mes",
    year: "year"
}

module.exports = {
    ESTADOS,
    ROLES,
    RANGO_TIEMPO
}