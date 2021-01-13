// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();

//Importar el controlador
const authController = require('../controllers/authController');

//Importar express-validator
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Loggear un usuario
// auth/usuarios
router.post('/', 
//Validamos con express-validator
// [
//     check('email', 'Agrega un email válido').isEmail(),
//     check('password', 'El password debe tener mínimo 6 caracteres').isLength({ min: 6 })
// ],
//Usamos el controlador
authController.autenticarUsuario 
);

// Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;