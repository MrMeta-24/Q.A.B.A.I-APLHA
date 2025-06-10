document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginSubmit = document.getElementById('login');
    const registerSubmit = document.getElementById('register');

    // Function to toggle between login and registration forms
    window.toggleForm = () => {
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
    };

    // Handle user registration
    registerSubmit.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        // Simple validation
        if (!username || !email || !password) {
            alert('Por favor, preencha todos os campos para se registrar.');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            alert('Este email já está registrado. Por favor, faça login ou use outro email.');
            return;
        }

        // Store user data in localStorage
        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Cadastro realizado com sucesso! Agora você pode fazer login.');
        toggleForm(); // Switch to login form after successful registration
        registerSubmit.reset(); // Clear the form
    });

    // Handle user login
    loginSubmit.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Simple validation
        if (!email || !password) {
            alert('Por favor, preencha todos os campos para fazer login.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            alert(`Bem-vindo, ${foundUser.username}! Login realizado com sucesso.`);
            // Redirect to inicio.html
            window.location.href = 'inicio.html';
        } else {
            alert('Email ou senha incorretos.');
        }
    });

     // Handle user logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn'); // Clear the logged-in flag
        alert('Você foi desconectado.');
        updateLogoutButtonVisibility(); // Hide the button
        window.location.href = 'login.html'; // Redirect back to the login page
    });

    // Sidebar toggle functionality (from your base code)
    window.toggleAside = () => {
        const aside = document.getElementById('asside');
        aside.classList.toggle('active');
    };

    window.fecharAside = () => {
        const aside = document.getElementById('asside');
        aside.classList.remove('active');
    };
});
