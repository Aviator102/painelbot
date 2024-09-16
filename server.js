const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Variáveis de ambiente
const BASEROW_API_URL = 'https://api.baserow.io/api/database/rows/table/<TABLE_ID>/'; // Substitua <TABLE_ID> pelo ID da tabela
const BASEROW_API_KEY = 'YOUR_BASEROW_API_KEY'; // Substitua pela sua chave de API do Baserow

// Configurar os headers para o Baserow
const headers = {
    'Authorization': `Token ${BASEROW_API_KEY}`,
    'Content-Type': 'application/json'
};

// Endpoint para salvar configurações
app.post('/api/config', async (req, res) => {
    const { botToken, groupId, greeting, advertisement, alert } = req.body;
    try {
        await axios.post(`${BASEROW_API_URL}/bots/`, { bot_token: botToken, group_id: groupId }, { headers });
        await axios.post(`${BASEROW_API_URL}/content/`, { greeting, advertisement, alert }, { headers });
        res.status(200).send('Configurações salvas');
    } catch (error) {
        res.status(500).send('Erro ao salvar configurações');
    }
});

// Endpoint para adicionar mensagens automáticas
app.post('/api/messages', async (req, res) => {
    const { message, scheduleTime } = req.body;
    try {
        await axios.post(`${BASEROW_API_URL}/messages/`, { message, schedule_time: scheduleTime }, { headers });
        res.status(200).send('Mensagem adicionada');
    } catch (error) {
        res.status(500).send('Erro ao adicionar mensagem');
    }
});

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
});
