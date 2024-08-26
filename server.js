const express = require('express');
const sql = require('mssql');
const path = require('path');

const app = express();
const port = 3000;

const config = {
    user: 'maguero_SQLLogin_1',
    password: '6f8pgxcc1n',
    server: 'TareaProgramada1.mssql.somee.com',
    database: 'TareaProgramada1',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }
};

// Middleware para manejar datos JSON
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener empleados
app.get('/empleados', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM EMPLEADOS');
        res.send(result.recordset);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching data', error: err.message });
    }
});

// Ruta para insertar un nuevo empleado
app.post('/insertar-empleado', async (req, res) => {
    const { Nombre, Salario } = req.body;

    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('Nombre', sql.VarChar, Nombre);
        request.input('Salario', sql.Money, Salario);

        // UUID generado automáticamente por la base de datos
        const result = await request.query(`
            INSERT INTO EMPLEADOS (Nombre, Salario) 
            VALUES (@Nombre, @Salario);
            SELECT SCOPE_IDENTITY() AS NewEmployeeId;
        `);

        res.status(200).send({ message: 'Empleado insertado correctamente', newEmployeeId: result.recordset[0].NewEmployeeId });
    } catch (err) {
        res.status(500).send({ message: 'Error al insertar el empleado', error: err.message });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:3000`);
});