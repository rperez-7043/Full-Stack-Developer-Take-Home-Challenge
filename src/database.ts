import mysql from 'mysql2';
import dotenv from 'dotenv'

dotenv.config()

// Configuración de la conexión a la base de datos
var connection = mysql.createConnection({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

connection.connect(err => {
    // Si hay error en la conexión, se lanza una excepción
    if (err) throw err;
});

// Exporta la conexión para ser utilizada en otras partes del código
export default connection;

/*
Estructura de la tabla en la base de datos:
+-------+--------------+------+-----+-----------+-------------------+
| Field | Type         | Null | Key | Default   | Extra             |
+-------+--------------+------+-----+-----------+-------------------+
| date  | date         | NO   | PRI | curdate() | DEFAULT_GENERATED |
| rate  | decimal(5,2) | NO   |     | NULL      |                   |
+-------+--------------+------+-----+-----------+-------------------+
*/