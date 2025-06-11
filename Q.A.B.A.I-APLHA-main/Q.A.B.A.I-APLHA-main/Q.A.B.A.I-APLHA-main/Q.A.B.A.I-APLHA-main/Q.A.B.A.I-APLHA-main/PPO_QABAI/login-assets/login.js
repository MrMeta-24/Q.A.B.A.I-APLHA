document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginSubmit = document.getElementById('login');
    const registerSubmit = document.getElementById('register');

    window.toggleForm = () => {
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
    };

    registerSubmit.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (!username || !email || !password) {
            alert('Por favor, preencha todos os campos para se registrar.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            alert('Este email já está registrado. Por favor, faça login ou use outro email.');
            return;
        }

        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Cadastro realizado com sucesso! Agora você pode fazer login.');
        toggleForm(); 
        registerSubmit.reset(); 
    });

    loginSubmit.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            alert('Por favor, preencha todos os campos para fazer login.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            alert(`Bem-vindo, ${foundUser.username}! Login realizado com sucesso.`);
            window.location.href = 'inicio.html';
        } else {
            alert('Email ou senha incorretos.');
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn'); 
        alert('Você foi desconectado.');
        updateLogoutButtonVisibility(); 
        window.location.href = 'login.html'; 
    });

    window.toggleAside = () => {
        const aside = document.getElementById('asside');
        aside.classList.toggle('active');
    };

    window.fecharAside = () => {
        const aside = document.getElementById('asside');
        aside.classList.remove('active');
    };
});
