const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM";
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let startTime;

function startTest() {
    let numQuestions = parseInt(document.getElementById("numQuestions").value);
    let upperLimit = parseInt(document.getElementById("upperLimit").value);
    
    if (upperLimit > 13) {
        alert("Upper limit cannot exceed 13.");
        return;
    }

    generateQuestions(numQuestions, upperLimit);
    document.getElementById("setup-screen").style.display = "none";
    document.getElementById("test-screen").style.display = "block";
    
    startTime = new Date();
    displayQuestion();
}

function generateQuestions(num, maxInt) {
    questions = [];
    for (let i = 0; i < num; i++) {
        let letterIndex = Math.floor(Math.random() * 26);
        let letter = alphabet[letterIndex];
        let number = Math.floor(Math.random() * (2 * maxInt + 1)) - maxInt;
        
        if (number === 0) number = 1;
        let resultIndex = letterIndex + number;
        
        if (resultIndex < 0 || resultIndex >= 39) {
            i--;
            continue;
        }
        
        let resultLetter = alphabet[resultIndex];
        let options = generateOptions(resultLetter);

        questions.push({ letter, number, resultLetter, options });
    }
}

function generateOptions(correctAnswer) {
    let options = new Set();
    options.add(correctAnswer);

    while (options.size < 4) {
        let randomLetter = alphabet[Math.floor(Math.random() * 39)];
        options.add(randomLetter);
    }
    
    return Array.from(options).sort(() => Math.random() - 0.5);
}

function displayQuestion() {
    let q = questions[currentQuestionIndex];
    document.getElementById("question-number").innerText = `${currentQuestionIndex + 1} / ${questions.length}`;
    document.getElementById("question-box").innerText = `${q.letter} ${q.number >= 0 ? "+" : ""}${q.number} = ?`;

    let optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach(option => {
        let div = document.createElement("div");
        div.innerText = option;
        div.classList.add("option");
        div.onclick = () => selectAnswer(div, option);
        optionsDiv.appendChild(div);
    });

    document.getElementById("feedback").innerText = "";
    selectedAnswer = null;
}

function selectAnswer(div, answer) {
    if (document.querySelector(".saved")) return;
    document.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));
    div.classList.add("selected");
    selectedAnswer = answer;
}

function saveAnswer() {
    if (!selectedAnswer) return alert("Please select an option before saving!");
    document.querySelector(".selected").classList.add("saved");
}
