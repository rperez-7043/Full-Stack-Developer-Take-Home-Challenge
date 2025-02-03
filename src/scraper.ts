import axios from 'axios';
import https from 'https';
import database from './database.js'
import schedule from 'node-schedule'
import * as cheerio from 'cheerio';


const URL = 'https://www.bcv.org.ve/';

// Función que obtiene la tasa de cambio de la página web
async function fetchExchangeRate(URL: string) {
    try {
        // Realiza una solicitud GET a la página usando Axios
        const response = await axios.get(URL, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
        const $ = cheerio.load(response.data);
        let exchangeRate = $('#dolar strong').text().trim();
        exchangeRate = parseFloat(exchangeRate.replace(",", ".")).toFixed(2);
        
        // Inserta la tasa de cambio en la base de datos o actualiza si ya existe
        const sql = `
        INSERT INTO ${process.env.DB_NAME}.${process.env.DB_TABLE} (rate)
        VALUES (?)
        ON DUPLICATE KEY UPDATE rate = ?;`;
        database.query(sql, [exchangeRate, exchangeRate], (err) => {
            if (err instanceof Error) {
                console.log(err);
                return;
            }
        });
    } catch (error) {
        console.error(error);
    }
};

// Configura una tarea programada para ejecutar la función a intervalos regulares
const rule = new schedule.RecurrenceRule();
// rule.minute = 0;
// rule.second = 0;
schedule.scheduleJob(rule, () => {
    fetchExchangeRate(URL);
});