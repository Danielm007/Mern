const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');

//Validacion
const { validationResult } = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async(req, res) => {

    //revisar errores de validacion
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() });
    }

    // Extraer el id del proyecto y comprobar que existe
    const { proyecto } = req.body;

    try {
        const existe = await Proyecto.findById(proyecto);
        if(!existe){
            return res.status(404).json({ msg: 'El proyecto no existe' });
        }
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        //Verificar el creador del proyecto
        if( existe.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

};

exports.obtenerTareas = async(req,res) => {

    try {

         // Extraemos el id del proyecto
        const { proyecto } = req.query;

        const existe = await Proyecto.findById(proyecto);
        if(!existe){
            return res.status(404).json({ msg: 'El proyecto no existe' });
        }
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        //Verificar el creador del proyecto
        if( existe.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json(tareas);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

// Actualizar una tarea
exports.actualizarTarea = async (req, res) => {

    try {

        // Extraemos el id del proyecto
        const { proyecto, nombre, estado } = req.body;

        // Revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({ msg: 'La tarea no existe' });
        }

        //Extraer proyecto
        const existe = await Proyecto.findById(proyecto);
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        //Verificar el creador del proyecto
        if( existe.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        

        // Creamos un objeto con la nueva información
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
    
        // Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true } );
        res.json(tarea);


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

};

// Eliminar una tarea por id
exports.eliminarTarea = async(req, res) => {
    try {

        // Extraemos el id del proyecto
        const { proyecto } = req.query;

        // Revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({ msg: 'La tarea no existe' });
        }

        //Extraer proyecto
        const existe = await Proyecto.findById(proyecto);
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        //Verificar el creador del proyecto
        if( existe.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        

        // Eliminar la tarea
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea Eliminada' });


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};