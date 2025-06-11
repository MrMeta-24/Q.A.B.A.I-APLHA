// A variável 'quizzes' é global e definida em 'quiz.js', sendo acessível aqui.
// A função 'saveQuizzes()' também é global e definida em 'quiz.js'.

let questionCounter = 1; // Inicializado para a primeira pergunta do formulário

// Função para mostrar a seção "Criar Quiz"
function showCreateQuizSection() {
    document.getElementById('quiz-options').style.display = 'none';
    document.getElementById('take-quiz-section').style.display = 'none';
    document.getElementById('quiz-display').style.display = 'none';
    document.getElementById('create-quiz-section').style.display = 'block';

    // Limpar o formulário e resetar o contador de perguntas ao abrir a seção de criação
    document.getElementById('create-quiz-form').reset();
    document.getElementById('questions-container').innerHTML = `
        <div class="question-block">
            <h3>Pergunta 1</h3>
            <label for="question-text-1">Texto da Pergunta:</label>
            <input type="text" id="question-text-1" required>

            <label for="option-1-1">Opção A:</label>
            <input type="text" id="option-1-1" required>
            <label for="option-1-2">Opção B:</label>
            <input type="text" id="option-1-2" required>
            <label for="option-1-3">Opção C:</label>
            <input type="text" id="option-1-3" required>
            <label for="option-1-4">Opção D:</label>
            <input type="text" id="option-1-4" required>

            <label for="correct-answer-1">Resposta Correta (A, B, C ou D):</label>
            <input type="text" id="correct-answer-1" maxlength="1" pattern="[A-Da-d]" required>
        </div>
    `;
    questionCounter = 1; // Resetar o contador
}


// Função para adicionar uma nova pergunta ao formulário de criação
function addQuestion() {
    questionCounter++;
    const questionsContainer = document.getElementById('questions-container');
    const newQuestionBlock = document.createElement('div');
    newQuestionBlock.classList.add('question-block');
    newQuestionBlock.innerHTML = `
        <h3>Pergunta ${questionCounter}</h3>
        <label for="question-text-${questionCounter}">Texto da Pergunta:</label>
        <input type="text" id="question-text-${questionCounter}" required>

        <label for="option-${questionCounter}-1">Opção A:</label>
        <input type="text" id="option-${questionCounter}-1" required>
        <label for="option-${questionCounter}-2">Opção B:</label>
        <input type="text" id="option-${questionCounter}-2" required>
        <label for="option-${questionCounter}-3">Opção C:</label>
        <input type="text" id="option-${questionCounter}-3" required>
        <label for="option-${questionCounter}-4">Opção D:</label>
        <input type="text" id="option-${questionCounter}-4" required>

        <label for="correct-answer-${questionCounter}">Resposta Correta (A, B, C ou D):</label>
        <input type="text" id="correct-answer-${questionCounter}" maxlength="1" pattern="[A-Da-d]" required>
    `;
    questionsContainer.appendChild(newQuestionBlock);
}

// Lidar com o envio do formulário de criação de quiz
document.getElementById('create-quiz-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const quizTitle = document.getElementById('quiz-title').value;
    const questions = [];

    // Coleta todas as perguntas do formulário
    for (let i = 1; i <= questionCounter; i++) {
        const questionText = document.getElementById(`question-text-${i}`).value;
        const optionA = document.getElementById(`option-${i}-1`).value;
        const optionB = document.getElementById(`option-${i}-2`).value;
        const optionC = document.getElementById(`option-${i}-3`).value;
        const optionD = document.getElementById(`option-${i}-4`).value;
        const correctAnswer = document.getElementById(`correct-answer-${i}`).value;

        if (questionText && optionA && optionB && optionC && optionD && correctAnswer) {
            questions.push({
                questionText: questionText,
                options: { A: optionA, B: optionB, C: optionC, D: optionD },
                correctAnswer: correctAnswer.toUpperCase()
            });
        } else {
            alert(`Por favor, preencha todos os campos da Pergunta ${i}.`);
            return; // Interrompe a criação do quiz se houver campos vazios
        }
    }

    if (quizTitle.trim() === '') {
        alert('Por favor, digite um título para o quiz.');
        return;
    }

    if (questions.length === 0) {
        alert('Por favor, adicione pelo menos uma pergunta ao quiz.');
        return;
    }

    const newQuiz = {
        title: quizTitle,
        questions: questions
    };

    quizzes.push(newQuiz); // Adiciona o novo quiz ao array global (de quiz.js)
    saveQuizzes(); // Salva os quizzes no localStorage (função de quiz.js)

    alert('Quiz criado com sucesso!');
    showTakeQuizSection(); // Volta para a tela de fazer quiz após criar (função de quiz.js)
});