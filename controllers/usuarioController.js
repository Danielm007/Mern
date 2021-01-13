//Importar el modelo
const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res, next) => {

    //Revisamos los errores de la validacion
    const errores = validationResult(req);
    if(!errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

    //Extraer el email y el password
    const { email, password } = req.body;

    try {

        //Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if (usuario){
            return res.status(400).json({msg: 'El usuario ya existe'});
        }
        // Crea el nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // Guardar usuario
        await usuario.save();
        
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

        // //Mensaje de confirmación
        // res.json({ msg: 'Usuario creado correctamente' });

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
};