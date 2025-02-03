# Full Stack Developer Take-Home Challenge

Este proyecto es un scraper que obtiene la tasa de cambio del dólar desde el sitio web del Banco Central de Venezuela (BCV) y expone los datos a través de una API RESTful.

## Instalación y Configuración

### Instalar dependencias

Instala las dependencias ejecutando el siguiente comando desde la raíz del proyecto:

```bash
npm install
```

### Configurar la base de datos MySQL

Ejecutar el siguiente SQL para crear la base de datos y la tabla:

```sql
CREATE DATABASE IF NOT EXISTS _nombre_de_base_de_datos;

USE _nombre_de_base_de_datos;

CREATE TABLE _nombre_de_tabla (
    date DATE DEFAULT (CURRENT_DATE()),
    rate DECIMAL(5,2) NOT NULL,
    PRIMARY KEY (date)
);

/* Antes de ejecutar el scraper por primera vez,
se recomienda llenar la base de datos con datos de prueba
para verificar el funcionamiento de la API. */

INSERT INTO _nombre_de_tabla (date, rate) VALUES
    (DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), 55.44),
    (DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), 54.44),
    (DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), 55.44),
    (DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), 56.44)
;

SELECT * FROM _nombre_de_tabla ORDER BY date DESC;
```

### Configurar las variables de entorno

Crear un archivo **.env** en la raíz del proyecto con el siguiente contenido:

```env
DB_NAME=_nombre_de_base_de_datos_
DB_TABLE=_nombre_de_tabla_
DB_USER=_usuario_de_base_de_datos_
DB_PASSWORD=_contraseña_de_usuario_
```

### Configurar la Ejecución del Scraper

Antes de iniciar el servidor, es importante tener en cuenta que el script scraper.ts está programado para ejecutarse automáticamente cada minuto, debido a la siguiente configuración:

```typescript
const rule = new schedule.RecurrenceRule();
// rule.minute = 0;
// rule.second = 0;
schedule.scheduleJob(rule, () => {
    fetchExchangeRate(URL);
});
```

Si deseas personalizar cuándo se ejecuta la tarea de scraping, debes establecer explícitamente los valores de **minute** y **second**. Aquí tienes algunos ejemplos de configuración::

#### Ejemplo 1, ejecutar la tarea todos los días a las 12:30 PM:

```typescript
const rule = new schedule.RecurrenceRule();
rule.minute = 12;
rule.second = 30;
schedule.scheduleJob(rule, () => {
    fetchExchangeRate(URL);
});
```

#### Ejemplo 2, ejecutar la tarea cada hora en un minuto específico (el minuto 30 de cada hora):

```typescript
const rule = new schedule.RecurrenceRule();
// rule.minute = 0;
rule.second = 30;
schedule.scheduleJob(rule, () => {
    fetchExchangeRate(URL);
});
```

#### Recomendación para la prueba del proyecto

Para probar el funcionamiento del scraper y la API correctamente, se recomienda establecer un valor para la variable **minute** que esté 5 minutos adelantado a la hora actual.

Por ejemplo, si actualmente son las 3:10 PM, puedes configurar el scraper para ejecutarse a las 3:15 PM con la siguiente configuración:

```typescript
const rule = new schedule.RecurrenceRule();
// rule.minute = 0;
rule.second = 15;
schedule.scheduleJob(rule, () => {
    fetchExchangeRate(URL);
});
```

Esto te dará suficiente tiempo para probar la API antes y después de la ejecución del scraper y verificar cómo cambia la información en la base de datos.

## Inicio del Servidor

Una vez configurado el entorno, inicia el servidor ejecutando:

```bash
npx tsc
```

Esto generará archivos **.js** a partir del código TypeScript. Debido a la configuración en el archivo **tsconfig.json**, estos archivos se crearán dentro de la carpeta **build**, gracias a la siguiente opción:

```json
"outDir": "./build"
```

Antes de continuar, asegúrate de que la carpeta **build** contiene los archivos **.js**. Si la compilación fue exitosa, deberías ver archivos como **index.js**, **routes.js**, **database.js**, etc. Una vez confirmes que los archivos están en **build/**, ejecuta el siguiente comando para iniciar el servidor:

```
node .\build\index.js
```

El servidor estará corriendo en `http://localhost:3000`.

## Endpoints

* GET `/`: Devuelve un mensaje de bienvenida en formato JSON indicando que la API de Tasa de Cambio está en ejecución.

* GET `/api/rates/current`: Devuelve la tasa de cambio más reciente almacenada en la base de datos.

* GET `/api/rates/history`: Devuelve el historial completo de tasas de cambio almacenadas en la base de datos.

* GET `/api/rates/history?start_date=20XX-XX-XX&end_date=20XX-XX-XX`: Devuelve el historial de tasas de cambio almacenadas en la base de datos dentro del rango de fechas especificado.