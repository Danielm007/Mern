const express = require('express');
const conectarDB = require('./config/db');
// Importamos cors para no tener problemas al momento de consumir la api
const cors = require('cors');

// Crear el servidor
const app = express();

//conectar a la base de datos
conectarDB();

//Habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }));

// Crear el puerto de la app
const port = process.env.port || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// Definir la pagina principal
app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

//Arancar al app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});