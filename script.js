// DOM Elements
const container = document.querySelector('.container');
const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const nextBtn = document.querySelector('.nextBtn');
const scoreCard = document.querySelector('.scoreCard');
const alertBox = document.querySelector('.alert');
const startBtn = document.querySelector('.startBtn');
const timer = document.querySelector('.timer');

// Quiz Data (will come from JSON Server)
let quiz = [];

// State Variables
let currentQuestionIndex = 0;
let score = 0;
let quizOver = false;
let timeLeft = 15;
let timerID = null;

//  ================= FETCH QUIZ DATA ================= 
const fetchQuizData = async () => {
  try {
    const response = await fetch("http://localhost:3001/quiz");
    quiz = await response.json();
    shuffleQuestions();
  } catch (error) {
    console.log("Error fetching quiz data:", error);
  }
};

//  ================= SHOW QUESTIONS ================= 
const showQuestions = () => {
  const questionDetails = quiz[currentQuestionIndex];
  questionBox.textContent = questionDetails.question;

  choicesBox.innerHTML = "";

  questionDetails.choices.forEach(choice => {
    const choiceDiv = document.createElement("div");
    choiceDiv.textContent = choice;
    choiceDiv.classList.add("choice");

    choiceDiv.addEventListener("click", () => {
      document
        .querySelectorAll(".choice")
        .forEach(c => c.classList.remove("selected"));
      choiceDiv.classList.add("selected");
    });

    choicesBox.appendChild(choiceDiv);
  });

  startTimer();
};

//  ================= CHECK ANSWER ================= 
const checkAnswer = () => {
  const selectedChoice = document.querySelector(".choice.selected");

  if (selectedChoice.textContent === quiz[currentQuestionIndex].answer) {
    displayAlert("Correct Answer!");
    score++;
  } else {
    displayAlert(
      `Wrong Answer! ${quiz[currentQuestionIndex].answer} is correct`
    );
  }

  timeLeft = 15;
  currentQuestionIndex++;

  if (currentQuestionIndex < quiz.length) {
    showQuestions();
  } else {
    stopTimer();
    showScore();
  }
};


// ================= SHOW SCORE ================= 
const showScore = () => {
  questionBox.textContent = "";
  choicesBox.textContent = "";
  scoreCard.textContent = `You Scored ${score} out of ${quiz.length}!`;
  displayAlert("Quiz Completed!");
  nextBtn.textContent = "Play Again";
  quizOver = true;
  timer.style.display = "none";
};

//  ================= ALERT ================= 
const displayAlert = (msg) => {
  alertBox.style.display = "block";
  alertBox.textContent = msg;
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 2000);
};

//  ================= TIMER =================
const startTimer = () => {
  clearInterval(timerID);
  timer.textContent = timeLeft;

  timerID = setInterval(() => {
    timeLeft--;
    timer.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timerID);
      const confirmUser = confirm(
        "Time Up! Do you want to play the quiz again?"
      );

      if (confirmUser) {
        startQuiz();
      } else {
        startBtn.style.display = "block";
        container.style.display = "none";
      }
    }
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerID);
};

//  ================= SHUFFLE QUESTIONS ================= 
const shuffleQuestions = () => {
  for (let i = quiz.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quiz[i], quiz[j]] = [quiz[j], quiz[i]];
  }
  currentQuestionIndex = 0;
  showQuestions();
};

//  ================= START QUIZ ================= 
const startQuiz = () => {
  score = 0;
  quizOver = false;
  timeLeft = 15;
  timer.style.display = "flex";
  scoreCard.textContent = "";
  nextBtn.textContent = "Next";
  fetchQuizData();
};

//  ================= EVENT LISTENERS ================= 
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  container.style.display = "block";
  startQuiz();
});

nextBtn.addEventListener("click", () => {
  const selectedChoice = document.querySelector(".choice.selected");

  if (!selectedChoice && !quizOver) {
    displayAlert("Please select an answer");
    return;
  }

  if (quizOver) {
    startQuiz();
  } else {
    checkAnswer();
  }
});
