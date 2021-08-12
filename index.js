var questionElement = document.getElementById("question");
var answersContainer = document.getElementById("answersContainer");
var retry = document.getElementById("retry");
var exit = document.getElementById("exit");
var numberOfQuestions = 10;
var score = 0;
// Retry the trivia
retry.addEventListener("click", () => {
  score = 0;
  main();
});
// Exit trivia
exit.addEventListener("click", () => {
  questionElement.innerHTML = "Thank you for playing!";
  while (answersContainer.firstChild) {
    answersContainer.removeChild(answersContainer.lastChild);
  }
});
//  Fetch trivia questions from opentdb https://opentdb.com/api.php?amount=10
const getTrivia = async () => {
  const response = await fetch("data.json");
  // const response = await fetch("data.json");
  const data = await response.json();
  return data.results;
};

// A questionGenerator to generate questions one at a time from an array of questions
function* questionGenerator(arr) {
  for (question of arr) {
    yield question;
  }
}

// Renders the question to the DOM
const setQuestion = (question) => {
  questionElement.innerHTML = question;
};

// Renders the answers options to the DOM.
// Waits for an answer then generates the next question.
const setAnswers = (options, status, generateQuestion) => {
  let correctAnswer = options[options.length - 1];
  for (answer of options) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerHTML = answer;
    answersContainer.appendChild(button);
    // Marks the question and loads the next question after answer has been submitted.
    button.addEventListener("click", () => {
      score += markQuestion(event.target.innerHTML, correctAnswer);
      nextQuestion(status, generateQuestion);
    });
  }
};

// Clears the question and the answers options from the DOM
const clearQuestionAnswer = () => {
  while (answersContainer.firstChild) {
    answersContainer.removeChild(answersContainer.lastChild);
  }
  questionElement.innerHTML = "";
};

// Marks the current question
const markQuestion = (answerGiven, correctAnswer) => {
  if (answerGiven === correctAnswer) {
    return 1;
  } else {
    return 0;
  }
};
// Loads the next question
const nextQuestion = (status, generateQuestion) => {
  if (!status) {
    trivia(generateQuestion);
  }
};

// Loads the final results after all questions have been answered 
const loadResults = (numberOfQuestions, score) => {
  questionElement.innerHTML = "Results";
  answersContainer.innerHTML = `${score}/${numberOfQuestions}`;
};

// The main function of the trivia
// 1. Generates a single question.
// 2. Clear Question and answers from the DOM if any
// 3. Sets the question visible on the DOM
// 4. Sets the answers in the DOM
const trivia = (generateQuestion) => {
  let triviaData = generateQuestion.next();
  let data = triviaData.value;
  let status = triviaData.done;

  // When all the questions have been answered, return the final score
  if (data === undefined) {
    loadResults(numberOfQuestions, score);
    return; // exit
  }
  clearQuestionAnswer();
  setQuestion(data.question);
  setAnswers(
    [...data.incorrect_answers, data.correct_answer],
    status,
    generateQuestion
  );
};

// Entry point
function main() {
  getTrivia()
    .then((questionsData) => {
      trivia(questionGenerator(questionsData));
    })
    .catch((error) => {
      console.log(error);
    });
}

main();