import express from 'express';
import database from './database.js'


const router = express.Router();

// Ruta para obtener la tasa de cambio actual
router.get('/current', (req, res) => {
    let sql = `
    SELECT DATE_FORMAT(date, "%Y-%m-%d") AS date, rate
    FROM ${process.env.DB_NAME}.${process.env.DB_TABLE}
    ORDER BY date DESC LIMIT 1;
    `;
    database.query(sql, (err, rows: any[]) => {
        if (err instanceof Error) {
            console.log(err);
            return;
        }
        res.json(rows[0]);
    });
});


// Ruta para obtener el historial de tasas de cambio
router.get('/history', (req, res) => {
    let sql = `
    SELECT DATE_FORMAT(date, "%Y-%m-%d") AS date, rate
    FROM ${process.env.DB_NAME}.${process.env.DB_TABLE}
    `;
    const { start_date, end_date } = req.query;

    if (start_date && end_date) {
        sql += ' WHERE date BETWEEN ? AND ?';
    }

    sql += ' ORDER BY date DESC;';
    database.query(sql, [start_date, end_date], (err, rows) => {
        if (err instanceof Error) {
            console.log(err);
            return;
        }
        res.json(rows);
    });
});

export default router;