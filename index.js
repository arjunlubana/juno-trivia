var questionElement = document.getElementById("question");
var answersContainer = document.getElementById("answersContainer");
var numberOfQuestions = 10;
var score = 0;

//  https://opentdb.com/api.php?amount=10
const getTrivia = async () => {
  const response = await fetch("data.json");
  const data = await response.json();
  return data.results;
};

// A questionGenerator to generate questions one at a time.
function* questionGenerator(arr) {
  for (question of arr) {
    yield question;
  }
}

// Renders the question to the DOM
const setQuestion = (question) => {
  questionElement.innerHTML = question;
};

/**
 *
 * @param {*} options
 * @param {*} status
 * @param {*} generateQuestion
 * @description Renders the choices for the question to the DOM.
 * Binds an event listener to every answer onclick. The listener marks the current question and loads new question
 */
const setAnswers = (options, status, generateQuestion) => {
  let correctAnswer = options[options.length - 1];
  for (answer of options) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerHTML = answer;
    answersContainer.appendChild(button);
    button.addEventListener("click", () => {
      score += markQuestion(event.target.innerHTML, correctAnswer);
      nextQuestion(status, generateQuestion);
    });
  }
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
  while (answersContainer.firstChild) {
    answersContainer.removeChild(answersContainer.lastChild);
  }
  questionElement.innerHTML = "";
  if (!status) {
    main(generateQuestion);
  }
};

const loadResults = (numberOfQuestions, score) => {
  questionElement.innerHTML = "Results";
  answersContainer.innerHTML = `${score}/${numberOfQuestions}`;

};
// The main trivia function
const main = (generateQuestion) => {
  let triviaData = generateQuestion.next();
  let data = triviaData.value;
  let status = triviaData.done;

  // When all the questions have been answered, return the final score
  if (data === undefined) {
    loadResults(numberOfQuestions, score);
    return 0; // exit
  }

  setQuestion(data.question);

  setAnswers(
    [...data.incorrect_answers, data.correct_answer],
    status,
    generateQuestion
  );
};

// Entry point
getTrivia()
  .then((questionsData) => {
    main(questionGenerator(questionsData));
  })
  .catch((error) => {
    console.log(error);
  });
