let questions = JSON.parse(localStorage.getItem('questions')) || [];
let score = 0;
let askedQuestions = [];

function addQuestion() {
    const questionText = document.getElementById('question-input').value.trim();
    const difficulty = parseInt(document.getElementById('difficulty-input').value.trim());
    const correctChoiceIndex = parseInt(document.getElementById('correct-choice').value);
    const choices = Array.from({ length: 5 }, (_, i) => document.getElementById(`choice-${i + 1}`).value.trim());

    if (questionText && difficulty >= 1 && difficulty <= 5 && choices.every(choice => choice !== '')) {
        questions.push({ text: questionText, difficulty, choices, correctChoice: correctChoiceIndex });
        localStorage.setItem('questions', JSON.stringify(questions));
        renderQuestions();
        document.getElementById('question-form').reset();
    } else {
        alert('Lütfen geçerli bir soru, zorluk derecesi ve tüm şıkları girin');
    }
}

function renderQuestions(filteredQuestions = questions) {
    const questionList = document.getElementById('question-list');
    questionList.innerHTML = filteredQuestions.map((q, i) => `
        <li>
            <span>${q.text} (Zorluk: ${q.difficulty})</span>
            <div>${q.choices.map((c, j) => `<span>${c} ${j === q.correctChoice ? '(Doğru)' : ''}</span>`).join('')}</div>
            <button onclick="editQuestion(${i})">Düzenle</button>
            <button onclick="deleteQuestion(${i})">Sil</button>
        </li>
    `).join('');
}

function deleteQuestion(index) {
    questions.splice(index, 1);
    localStorage.setItem('questions', JSON.stringify(questions));
    renderQuestions();
}

function editQuestion(index) {
    const question = questions[index];
    const newQuestionText = prompt('Yeni soru:', question.text);
    const newDifficulty = parseInt(prompt('Yeni zorluk (1-5):', question.difficulty));
    const newChoices = question.choices.map((choice, i) => prompt(`Yeni şık ${i + 1}:`, choice) || choice);
    const newCorrectChoice = parseInt(prompt('Yeni doğru şık (1-5):', question.correctChoice + 1)) - 1;

    if (newQuestionText && newDifficulty >= 1 && newDifficulty <= 5 && newChoices.every(c => c !== '') && newCorrectChoice >= 0 && newCorrectChoice < 5) {
        questions[index] = { text: newQuestionText, difficulty: newDifficulty, choices: newChoices, correctChoice: newCorrectChoice };
        localStorage.setItem('questions', JSON.stringify(questions));
        renderQuestions();
    } else {
        alert('Lütfen geçerli değerler girin.');
    }
}

function searchQuestion() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredQuestions = questions.filter(q => q.text.toLowerCase().includes(searchInput));
    renderQuestions(filteredQuestions);
}

function getRandomQuestion() {
    if (askedQuestions.length === questions.length) {
        alert(`Sorular bitti! Toplam Puan: ${score}`);
        score = 0;
        askedQuestions = [];
        document.getElementById('score').textContent = `Puan: ${score}`;
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * questions.length);
    } while (askedQuestions.includes(randomIndex));

    askedQuestions.push(randomIndex);
    const randomQuestion = questions[randomIndex];
    document.getElementById('random-question').innerHTML = `
        <div>${randomQuestion.text} (Zorluk: ${randomQuestion.difficulty})</div>
        ${randomQuestion.choices.map((choice, i) => `<button onclick="answerQuestion(${randomIndex}, ${i})">${choice}</button>`).join('')}
    `;
}

function answerQuestion(questionIndex, choiceIndex) {
    const question = questions[questionIndex];
    if (choiceIndex === question.correctChoice) {
        score += question.difficulty;
        document.getElementById('score').textContent = `Puan: ${score}`;
        alert('Doğru Cevap!');
    } else {
        alert('Yanlış Cevap!');
    }
    getRandomQuestion();
}

window.onload = renderQuestions;
