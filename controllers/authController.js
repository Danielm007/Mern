//Importar el modelo
const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario =  async(req, res) => {
    
    //Revisamos los errores de la validacion
    const errores = validationResult(req);
    if(!errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

    // Extraer el email y password
    const { email, password } = req.body;

    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if(!usuario){
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // Revisar su password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);

        if(!passCorrecto){
            return res.status(400).json({ msg: 'Password Incorrecto' });
        }

        // Si todo es correcto creamos el jwt

        //Crear y firmar el json web token
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //1 hora
        }, (error, token)=> {
            if(error) throw error;

            //Mensaje de confirmación
            res.json({ token });
            
        });


    } catch (error) {
        console.log(error);
    }
};

// Obtiene que usuario está autenticado
exports.usuarioAutenticado = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
};