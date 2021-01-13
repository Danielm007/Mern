const express = require('express');
const router = express.Router();

//Controlador de tareas
const tareaController = require('../controllers/tareaController');

//Autenticacion
const auth = require('../middleware/auth');

//Validacion
const { check } = require('express-validator');


// Crear tarea

// /api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

// Obtener las tareas del proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
);

// Actualizar Tarea
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

// Eliminar una tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;