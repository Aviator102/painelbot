document.addEventListener('DOMContentLoaded', () => {
    const settingsForm = document.getElementById('settings-form');
    const messagesForm = document.getElementById('messages-form');
    const addBotButton = document.getElementById('addBotButton');
    const statusMessage = document.getElementById('statusMessage');

    settingsForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const botToken = document.getElementById('botToken').value;
        const groupId = document.getElementById('groupId').value;
        const greeting = document.getElementById('greeting').value;
        const advertisement = document.getElementById('advertisement').value;
        const alert = document.getElementById('alert').value;

        await fetch('/api/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                botToken,
                groupId,
                greeting,
                advertisement,
                alert
            }),
        });

        alert('Configurações salvas com sucesso!');
    });

    messagesForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const message = document.getElementById('message').value;
        const scheduleTime = document.getElementById('scheduleTime').value;

        await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                scheduleTime
            }),
        });

        alert('Mensagem adicionada com sucesso!');
    });

    addBotButton.addEventListener('click', async () => {
        const botToken = document.getElementById('botToken').value;

        try {
            const response = await fetch('/api/test-bot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ botToken }),
            });

            const result = await response.json();
            if (response.ok) {
                statusMessage.textContent = 'Bot adicionado com sucesso!';
            } else {
                statusMessage.textContent = `Erro: ${result.message}`;
            }
        } catch (error) {
            statusMessage.textContent = 'Erro ao conectar com o bot.';
        }
    });
});
