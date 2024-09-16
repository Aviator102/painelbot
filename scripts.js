document.addEventListener('DOMContentLoaded', () => {
    const botConfigForm = document.getElementById('botConfigForm');
    const messageForm = document.getElementById('messageForm');
    const contentForm = document.getElementById('contentForm');
    const startBotButton = document.getElementById('startBot');
    const stopBotButton = document.getElementById('stopBot');
    const messageList = document.getElementById('messageList');

    // Enviar configuração do bot
    botConfigForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const botToken = document.getElementById('botToken').value;
        const groupId = document.getElementById('groupId').value;
        
        await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ botToken, groupId })
        });
        alert('Configurações salvas!');
    });

    // Adicionar mensagem automática
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = document.getElementById('message').value;
        const scheduleTime = document.getElementById('scheduleTime').value;
        
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, scheduleTime })
        });
        alert('Mensagem adicionada!');
        loadMessages(); // Recarrega a lista de mensagens
    });

    // Atualizar conteúdo do bot
    contentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const greeting = document.getElementById('greeting').value;
        const advertisement = document.getElementById('advertisement').value;
        const alert = document.getElementById('alert').value;

        await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ greeting, advertisement, alert })
        });
        alert('Conteúdo atualizado!');
    });

    // Controlar o bot
    startBotButton.addEventListener('click', async () => {
        await fetch('/api/control/start', { method: 'POST' });
        alert('Bot iniciado!');
    });

    stopBotButton.addEventListener('click', async () => {
        await fetch('/api/control/stop', { method: 'POST' });
        alert('Bot parado!');
    });

    // Carregar mensagens automáticas
    async function loadMessages() {
        const response = await fetch('/api/messages');
        const messages = await response.json();
        messageList.innerHTML = messages.map(msg => `<div class="message-item">${msg.text} (Programada para ${msg.scheduleTime} minutos)</div>`).join('');
    }

    loadMessages(); // Carrega mensagens ao iniciar
});
