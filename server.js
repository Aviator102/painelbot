const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { Telegraf } = require('telegraf');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Variáveis de ambiente
const BASEROW_API_URL = 'https://api.baserow.io/api/database/rows/table/<TABLE_ID>/'; // Substitua <TABLE_ID> pelo ID da tabela
const BASEROW_API_KEY = 'YOUR_BASEROW_API_KEY'; // Substitua pela sua chave de API do Baserow
let TELEGRAM_BOT_TOKEN = ''; // Token do bot do Telegram

// Configurar os headers para o Baserow
const headers = {
    'Authorization': `Token ${BASEROW_API_KEY}`,
    'Content-Type': 'application/json'
};

// Inicializar o bot do Telegram
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply('Bem-vindo! Use o painel administrativo para configurar o bot.'));
bot.on('text', async (ctx) => {
    try {
        // Buscar saudação do Baserow
        const response = await axios.get(`${BASEROW_API_URL}/content/`, { headers });
        const greeting = response.data.greeting || 'Olá, tudo bem? Como posso ajudar hoje, meu amigo!';

        if (ctx.message.chat.type === 'private') {
            ctx.reply(greeting);
        }
    } catch (error) {
        console.error('Erro ao obter saudação do Baserow:', error);
        ctx.reply('Olá, tudo bem? Como posso ajudar hoje, meu amigo!');
    }
});

// Endpoint para salvar configurações
app.post('/api/config', async (req, res) => {
    const { botToken, groupId, greeting, advertisement, alert } = req.body;
    TELEGRAM_BOT_TOKEN = botToken; // Atualiza o token do bot
    try {
        await axios.post(`${BASEROW_API_URL}/bots/`, { bot_token: botToken, group_id: groupId }, { headers });
        await axios.post(`${BASEROW_API_URL}/content/`, { greeting, advertisement, alert }, { headers });
        res.status(200).send('Configurações salvas');
    } catch (error) {
        res.status(500).send('Erro ao salvar configurações');
    }
});

// Endpoint para testar a conexão do bot
app.post('/api/test-bot', async (req, res) => {
    const { botToken } = req.body;
    try {
        const testBot = new Telegraf(botToken);
        await testBot.telegram.getMe(); // Testa a conexão com o bot
        res.status(200).json({ message: 'Bot conectado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao conectar com o bot.' });
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

bot.launch();
