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


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/empleados', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM EMPLEADOS');
        res.send(result.recordset);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching data', error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:3000`);
});