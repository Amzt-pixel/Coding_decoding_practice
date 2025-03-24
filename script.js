const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM"; // Custom 39-letter system
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let correctCount = 0;
let wrongCount = 0;
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
    
    startTime = new Date(); // Start the timer
    displayQuestion();
}

function generateQuestions(num, maxInt) {
    questions = [];
    for (let i = 0; i < num; i++) {
        let letterIndex = Math.floor(Math.random() * 26); // A-Z (1-26)
        let letter = alphabet[letterIndex];
        let number = Math.floor(Math.random() * (2 * maxInt + 1)) - maxInt; // Range: -maxInt to +maxInt
        
        if (number === 0) number = 1; // Avoid zero
        let resultIndex = letterIndex + number;
        
        if (resultIndex < 0 || resultIndex >= 39) {
            i--; // Regenerate if out of bounds
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
    document.getElementById("question-text").innerText = `${q.letter} ${q.number >= 0 ? "+" : ""}${q.number} = ?`;

    let optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach(option => {
        let div = document.createElement("div");
        div.innerText = option;
        div.onclick = () => selectAnswer(div, option);
        optionsDiv.appendChild(div);
    });

    document.getElementById("feedback").innerText = "";
    selectedAnswer = null;
}

function selectAnswer(div, answer) {
    if (document.querySelector(".saved")) return; // Prevent changing after save

    document.querySelectorAll("#options div").forEach(el => el.classList.remove("selected"));
    div.classList.add("selected");
    selectedAnswer = answer;
}

function saveAnswer() {
    if (!selectedAnswer) return alert("Please select an option before saving!");

    document.querySelector(".selected").classList.add("saved");
    let correctAnswer = questions[currentQuestionIndex].resultLetter;

    if (selectedAnswer === correctAnswer) {
        document.getElementById("feedback").innerText = "Very Good! Your answer is correct!";
        correctCount++;
    } else {
        document.getElementById("feedback").innerText = "Oops! That was wrong!";
        wrongCount++;
    }
}

function nextQuestion() {
    if (!document.querySelector(".saved")) return alert("You must save your answer first!");

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        submitTest();
    }
}

function submitTest() {
    let totalTime = Math.floor((new Date() - startTime) / 1000);
    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;

    document.getElementById("test-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "block";

    document.getElementById("correctCount").innerText = correctCount;
    document.getElementById("wrongCount").innerText = wrongCount;
    document.getElementById("unattemptedCount").innerText = questions.length - (correctCount + wrongCount);
    document.getElementById("timeTaken").innerText = `${minutes} min ${seconds} sec`;
}
