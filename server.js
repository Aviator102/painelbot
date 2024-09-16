const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Configurar banco de dados SQLite
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS config (botToken TEXT, groupId TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS messages (text TEXT, scheduleTime INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS content (greeting TEXT, advertisement TEXT, alert TEXT)");
});

// Endpoint para salvar configurações
app.post('/api/config', (req, res) => {
    const { botToken, groupId } = req.body;
    db.run("DELETE FROM config");
    db.run("INSERT INTO config (botToken, groupId) VALUES (?, ?)", [botToken, groupId], (err) => {
        if (err) {
            res.status(500).send('Erro ao salvar configurações');
        } else {
            res.status(200).send('Configurações salvas');
        }
    });
});

// Endpoint para obter configurações
app.get('/api/config', (req, res) => {
    db.get("SELECT * FROM config", (err, row) => {
        if (err) {
            res.status(500).send('Erro ao obter configurações');
        } else {
            res.json(row);
        }
    });
});

// Endpoint para adicionar mensagens
