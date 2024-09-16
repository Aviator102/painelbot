document.addEventListener('DOMContentLoaded', () => {
    const settingsForm = document.getElementById('settings-form');
    const messagesForm = document.getElementById('messages-form');

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
});
