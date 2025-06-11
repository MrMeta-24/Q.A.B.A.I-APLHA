function toggleAside() {
    const aside = document.getElementById('asside');
    aside.classList.toggle('open');
}

function fecharAside() {
    const aside = document.getElementById('asside');
    aside.classList.remove('open');
}


const LOCAL_STORAGE_KEY = 'chatDoubtTopics';

let chatsData = {};

function saveChatsData() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chatsData));
    console.log('Dados do chat salvos no localStorage.');
}

function loadChatsData() {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
        chatsData = JSON.parse(storedData);
        console.log('Dados do chat carregados do localStorage.');
    } else {
        chatsData = {
            geral: {
                title: "Dúvidas Gerais",
                messages: [
                    { type: "received", text: "Olá! Bem-vindo ao chat de Dúvidas Gerais." },
                    { type: "sent", text: "Como posso fazer uma pergunta?" },
                    { type: "received", text: "Basta digitar sua dúvida na caixa de texto abaixo e enviar!" }
                ]
            },
            programacao: {
                title: "Programação",
                messages: [
                    { type: "received", text: "Este é o chat para dúvidas sobre programação." },
                    { type: "sent", text: "Qual a melhor linguagem para começar?" }
                ]
            },
            design: {
                title: "Design",
                messages: [
                    { type: "received", text: "Tire suas dúvidas sobre design aqui!" }
                ]
            }
        };
        saveChatsData();
    }
}

let activeChatId = 'geral';

document.addEventListener('DOMContentLoaded', () => {
    loadChatsData();

    const chatList = document.getElementById('chat-list');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const chatTitle = document.getElementById('chat-title');
    const newChatBtn = document.getElementById('new-chat-btn');

    function renderChatList() {
        chatList.innerHTML = '';

        if (!chatsData[activeChatId]) {
            const firstChatId = Object.keys(chatsData)[0];
            activeChatId = firstChatId || 'geral';
            if (!chatsData[activeChatId]) {
                chatsData['geral'] = { title: "Dúvidas Gerais", messages: [] };
                saveChatsData();
            }
        }

        Object.keys(chatsData).forEach(chatId => {
            const chat = chatsData[chatId];
            const newItem = document.createElement('li');
            newItem.classList.add('chat-item');
            if (chatId === activeChatId) {
                newItem.classList.add('active');
            }
            newItem.dataset.chatId = chatId;
            newItem.textContent = chat.title;
            chatList.appendChild(newItem);
        });
    }

    function loadChatMessages() {
        chatMessages.innerHTML = '';
        const currentChat = chatsData[activeChatId];
        chatTitle.textContent = currentChat.title;

        currentChat.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', msg.type);
            messageDiv.textContent = msg.text;
            chatMessages.appendChild(messageDiv);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('chat-item')) {
            const newChatId = target.dataset.chatId;
            if (newChatId !== activeChatId) {
                const currentActive = document.querySelector('.chat-item.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }

                target.classList.add('active');
                activeChatId = newChatId;
                loadChatMessages();
            }
        }
    });

    function sendMessage() {
        const text = messageInput.value.trim();
        if (text) {
            const currentChat = chatsData[activeChatId];
            const newMessage = { type: "sent", text: text };
            currentChat.messages.push(newMessage);

            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', newMessage.type);
            messageDiv.textContent = newMessage.text;
            chatMessages.appendChild(messageDiv);

            messageInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            saveChatsData();

            setTimeout(() => {
                const botResponse = { type: "received", text: "Entendi sua dúvida. Vamos procurar uma resposta para isso!" };
                currentChat.messages.push(botResponse);
                const botMessageDiv = document.createElement('div');
                botMessageDiv.classList.add('message', botResponse.type);
                botMessageDiv.textContent = botResponse.text;
                chatMessages.appendChild(botMessageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                saveChatsData();
            }, 1000);
        }
    }

    sendMessageBtn.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    newChatBtn.addEventListener('click', () => {
        const chatName = prompt("Digite o nome do novo tópico de dúvida:");
        if (chatName && chatName.trim() !== '') {
            const newChatId = chatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            if (!chatsData[newChatId]) {
                chatsData[newChatId] = {
                    title: chatName,
                    messages: [{ type: "received", text: `Bem-vindo ao novo chat: ${chatName}!` }]
                };

                saveChatsData();

                renderChatList();

                const currentActive = document.querySelector('.chat-item.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                const newItem = document.querySelector(`[data-chat-id="${newChatId}"]`);
                if (newItem) {
                    newItem.classList.add('active');
                    activeChatId = newChatId;
                    loadChatMessages();
                }

            } else {
                alert("Este tópico já existe!");
            }
        }
    });

    renderChatList();
    loadChatMessages();
});