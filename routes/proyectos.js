//Creamos el enrutador con express
const express = require('express');
const router = express.Router();
//Validacion
const { check } = require('express-validator');
// Importamos la autenticacion para verificar el token
const auth = require('../middleware/auth');

//Importamos el controlador de proyectos
const proyectoController = require('../controllers/proyectoController');

// Crea un proyecto
// api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ], 
    proyectoController.crearProyecto
);

//Obtener todos los proyectos
router.get('/',
    auth, 
    proyectoController.obtenerProyectos
);

//Actualizar un proyecto via ID
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//Eliminar un proyecto por id
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);


module.exports = router;