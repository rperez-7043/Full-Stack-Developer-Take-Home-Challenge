import express from 'express';
import routes from './routes.js'
import './scraper.js'


const app = express()
const port = 3000

// Ruta principal, responde con un mensaje de bienvenida y el estado de la API
app.get('/', (req, res) => {
    res.json({
        message: "Bienvenido a la API de Tasa de Cambio",
        status: "En ejecución",
    });
});

// Ruta para manejar las peticiones relacionadas con tasas de cambio
app.use('/api/rates', routes);

// El servidor escucha en el puerto 3000
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});