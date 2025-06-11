document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos principais
    const quizMenu = document.getElementById('quiz-menu');
    const quizPlayer = document.getElementById('quiz-player');
    const quizCreator = document.getElementById('quiz-creator');
    const quizContainer = document.getElementById('quiz-container');
    const submitQuizButton = document.getElementById('submit-quiz');
    const quizResults = document.getElementById('quiz-results');
    const createQuizForm = document.getElementById('create-quiz-form');
    const questionsContainer = document.getElementById('questions-container');
    const quizCreationMessage = document.getElementById('quiz-creation-message');

    // Estado do quiz
    let currentQuiz = [];
    let userAnswers = {};
    let currentQuizIndex = 0;

    let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];

    // --- Funções de Navegação entre Telas ---

    window.showQuizPlayer = function() {
        quizMenu.style.display = 'none';
        quizCreator.style.display = 'none';
        quizPlayer.style.display = 'block';
        loadAvailableQuizzes();
    };

    window.showQuizCreator = function() {
        quizMenu.style.display = 'none';
        quizPlayer.style.display = 'none';
        quizCreator.style.display = 'block';
        resetQuizCreatorForm();
        quizCreationMessage.style.display = 'none';
    };

    window.goBackToQuizMenu = function() {
        quizMenu.style.display = 'block';
        quizPlayer.style.display = 'none';
        quizCreator.style.display = 'none';
        quizResults.style.display = 'none';
        quizCreationMessage.style.display = 'none';
    };

    // --- Lógica para Fazer Quiz ---

    function loadAvailableQuizzes() {
        quizContainer.innerHTML = '<h3>Quizzes Disponíveis:</h3>';
        if (quizzes.length === 0) {
            quizContainer.innerHTML += '<p>Nenhum quiz disponível ainda. Que tal criar um?</p>';
            submitQuizButton.style.display = 'none';
        }

        quizzes.forEach((quiz, index) => {
            const quizCard = document.createElement('div');
            quizCard.classList.add('quiz-card');
            quizCard.innerHTML = `
                <h4>${quiz.title}</h4>
                <p>Total de perguntas: ${quiz.questions.length}</p>
                <button onclick="startQuiz(${index})">Iniciar Quiz</button>
            `;
            quizContainer.appendChild(quizCard);
        });
        submitQuizButton.style.display = 'none';
        quizResults.style.display = 'none';

        const createQuizBtn = document.createElement('button');
        createQuizBtn.textContent = 'Criar Novo Quiz';
        createQuizBtn.onclick = showQuizCreator;
        quizContainer.appendChild(createQuizBtn);
    }

    window.startQuiz = function(quizIndex) {
        currentQuiz = quizzes[quizIndex];
        userAnswers = {};
        currentQuizIndex = 0;
        quizContainer.innerHTML = '';
        displayQuestion(currentQuiz.questions[currentQuizIndex]);
        submitQuizButton.style.display = 'block';
        submitQuizButton.textContent = 'Próxima Pergunta';
    };

    // FUNÇÃO displayQuestion ATUALIZADA PARA USAR TEXTAREA
    function displayQuestion(question) {
        quizContainer.innerHTML = `
            <div class="question-block">
                <h3>${question.questionText}</h3>
                <div class="answer-container">
                    <label for="user-answer">Sua Resposta:</label><br>
                    <textarea id="user-answer" rows="4" cols="50" placeholder="Digite sua resposta aqui..." data-question="${question.questionText}"></textarea>
                </div>
            </div>
        `;

        // Se houver uma resposta anterior para esta pergunta, pré-preenche a área de texto
        const existingAnswer = userAnswers[question.questionText];
        if (existingAnswer) {
            const userAnswerTextarea = quizContainer.querySelector('#user-answer');
            if (userAnswerTextarea) {
                userAnswerTextarea.value = existingAnswer;
            }
        }

        if (currentQuizIndex === currentQuiz.questions.length - 1) {
            submitQuizButton.textContent = 'Finalizar Quiz';
        } else {
            submitQuizButton.textContent = 'Próxima Pergunta';
        }
    }

    submitQuizButton.addEventListener('click', () => {
        const userAnswerInput = document.querySelector('#user-answer');
        if (!userAnswerInput || userAnswerInput.value.trim() === '') {
            alert('Por favor, digite sua resposta antes de continuar.');
            return;
        }

        const questionText = userAnswerInput.dataset.question;
        // Armazena a resposta do usuário, convertendo para minúsculas para comparação não sensível a maiúsculas/minúsculas
        userAnswers[questionText] = userAnswerInput.value.trim().toLowerCase();

        currentQuizIndex++;

        if (currentQuizIndex < currentQuiz.questions.length) {
            displayQuestion(currentQuiz.questions[currentQuizIndex]);
        } else {
            showQuizResults();
        }
    });

    function showQuizResults() {
        quizContainer.style.display = 'none';
        submitQuizButton.style.display = 'none';
        quizResults.style.display = 'block';

        let correctCount = 0;
        let resultsHtml = '<h3>Seus Resultados:</h3>';

        currentQuiz.questions.forEach(question => {
            const userAnswer = userAnswers[question.questionText];
            // Compara a resposta do usuário (em minúsculas) com a resposta correta (também em minúsculas)
            const isCorrect = userAnswer === question.correctAnswer.toLowerCase();
            resultsHtml += `
                <p><strong>Pergunta:</strong> ${question.questionText}</p>
                <p>Sua Resposta: <span style="color: ${isCorrect ? 'green' : 'red'};">${userAnswer || 'Não respondida'}</span></p>
                <p>Resposta Correta: <span style="color: green;">${question.correctAnswer}</span></p>
                <hr>
            `;
            if (isCorrect) {
                correctCount++;
            }
        });

        resultsHtml += `<h4>Você acertou ${correctCount} de ${currentQuiz.questions.length} perguntas!</h4>`;
        quizResults.innerHTML = resultsHtml;

        const backButton = document.createElement('button');
        backButton.textContent = 'Voltar aos Quizzes';
        backButton.onclick = function() {
            quizResults.style.display = 'none';
            quizContainer.style.display = 'block';
            loadAvailableQuizzes();
        };
        quizResults.appendChild(backButton);
    }

    // --- Lógica para Criar Quiz ---

    window.addQuestionField = function() {
        const questionBlocks = questionsContainer.querySelectorAll('.question-block').length;
        const newQuestionBlock = document.createElement('div');
        newQuestionBlock.classList.add('question-block');
        newQuestionBlock.innerHTML = `
            <label>Pergunta ${questionBlocks + 1}:</label><br>
            <input type="text" class="question-text" placeholder="Digite a pergunta" required><br>
            <label>Resposta Correta (texto exato para comparação):</label><br>
            <input type="text" class="question-answer" placeholder="Ex: Rio de Janeiro" required><br><br>
        `;
        questionsContainer.appendChild(newQuestionBlock);
    };

    createQuizForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const quizTitle = document.getElementById('quiz-title').value.trim();
        const questions = [];
        let isValid = true;

        const questionBlocks = questionsContainer.querySelectorAll('.question-block');
        questionBlocks.forEach(block => {
            const questionText = block.querySelector('.question-text').value.trim();
            // const optionsInput = block.querySelector('.question-options').value.trim(); // REMOVIDO
            const correctAnswer = block.querySelector('.question-answer').value.trim();

            if (!questionText || !correctAnswer) { // Validação ajustada
                isValid = false;
                return;
            }

            // const options = optionsInput.split(',').map(option => option.trim()); // REMOVIDO

            // A validação de 'resposta correta estar entre as opções' não é mais necessária
            // if (!options.includes(correctAnswer)) {
            //     alert(`A resposta correta "${correctAnswer}" para a pergunta "${questionText}" não está entre as opções.`);
            //     isValid = false;
            //     return;
            // }

            questions.push({
                questionText,
                // options: options, // REMOVIDO
                correctAnswer: correctAnswer // Salva a resposta como está, a comparação será feita em minúsculas
            });
        });

        if (!isValid) {
            alert('Por favor, preencha todos os campos obrigatórios (Pergunta e Resposta Correta).');
            return;
        }

        if (questions.length === 0) {
            alert('Por favor, adicione pelo menos uma pergunta ao seu quiz.');
            return;
        }

        const newQuiz = {
            title: quizTitle,
            questions: questions
        };

        quizzes.push(newQuiz);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));

        quizCreator.style.display = 'none';
        quizCreationMessage.style.display = 'block';
        quizCreationMessage.innerHTML = `
            <h3>Quiz "${quizTitle}" criado com sucesso!</h3>
            <button onclick="goBackToQuizMenu()">Voltar ao Menu Principal</button>
            <button onclick="showQuizCreator()">Criar Outro Quiz</button>
        `;
    });

    function resetQuizCreatorForm() {
        createQuizForm.reset();
        questionsContainer.innerHTML = `
            <h3>Perguntas:</h3>
            <div class="question-block">
                <label>Pergunta 1:</label><br>
                <input type="text" class="question-text" placeholder="Digite a pergunta" required><br>
                <label>Resposta Correta (texto exato para comparação):</label><br>
                <input type="text" class="question-answer" placeholder="Ex: Rio de Janeiro" required><br><br>
            </div>
        `;
    }

    // Funções do aside
    window.toggleAside = function() {
        document.getElementById('asside').classList.toggle('active');
    };

    window.fecharAside = function() {
        document.getElementById('asside').classList.remove('active');
    };
});