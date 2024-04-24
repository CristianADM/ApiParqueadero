# Apirest Parqueadero
#### Apirest Parqueadero
***
## Índice
1. [Características](#características)
2. [Contenido del proyecto](#contenido-del-proyecto)
3. [Tecnologías](#tecnologías)
4. [IDE](#ide)
5. [Instalación](#instalación)
6. [Ejecutar los contenedores](#ejecutar-los-contenedores)
7. [Documentación de los enpoints](#documentación-de-los-enpoints)
8. [Autor(es)](#autores)
***
#### Características

  - Desarrollado con Node Js (Exress)
  - Orm (Sequelize)
  - Jwt
  - Simulacion de envio de correo
***
  #### Contenido del proyecto

| Archivo      | Descripción  |
|--------------|--------------|
| [Backend](https://github.com/CristianADM/ApiParqueadero) | Desarrollo del backend de la aplicación |
***
#### Tecnologías
  - JavaScript
  - Node js
  - Sequelize
  - MySql
  - Git
  
  
  ***
#### IDE

- El proyecto se desarrolla usando Visual Studio Code, es un editor de texto para código en diferentes lenguajes.

  ***
#### Requisitos
- Node Js (20.11.0)
- MySql (8.0.34)
- Git

***
### Instalación
- Descargar o clonar el repositorio
- Se debe crear un archivo .env que posea las siguientes variables de entorno: 
  ```
    PORT: Puerto que se utilizara para exponer el backend (ej. 8080)
    -----DB-----
    NOMBRE_ESQUEMA: Nombre de la base de datos que se va a utilizar
    USUARIO: Usuario de la base de datos
    CONTRASENNA: Contraseña del usuario de la base de datos
    HOST: Dirección ip o punto de enlace para conectarse a la base de datos
    ----jwt----
    DURACIONTOKEN: Duración del token por ejemplo: 6h
    SECRETKEY: Token secreto para jwt (ejemplo. Tok3nF4ls0)
  ```
  ***  
### Ejecutar proyecto en ambiente local

Para ejecutar el proyecto de manera local se debe llevar a cabo los siguientes pasos:

##### Base de datos
```
    Se debe crear la base de datos en MySql
    Se debe ejecutar el script de base de datos db_parqueadero.sql que contiene la creacion de las tablas y el usuario administrador.
```

##### Proyecto
```
    Se debe clonar el proyecto del [repositorio](https://github.com/CristianADM/ApiParqueadero "repositorio")
    Se abre la consola de comandos
    Se ejecuta el comando: npm install
    Se debe crear un archivo .env en la carpeta raiz del proyecto.
    Se ejecuta el comando: node app.js el cual ejecutara el proyecto.
    Se prueban los endpoints.
```

El proyecto tiene en su script de base de datos un usuario por defecto, el cual permite crear los usuarios socios

Para hacer login con este usuario es: 
- usuario: admin@admin.com 
- password: admin

  ***

### Documentación de los enpoints
[Enpoints](https://documenter.getpostman.com/view/21358234/2sA3BobY2m "Enpoints")

  ***

### Autor(es)

Proyecto desarrollado por [Cristian Duarte](<andresmaldonado6@hotmail.com>).

  ***
