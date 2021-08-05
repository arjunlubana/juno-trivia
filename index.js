var questionElement = document.getElementById("question");
var answersContainer = document.getElementById("answersContainer");
var answersGiven = [];
var correctAnswers = [];

/**
 *
 * @param {number} index the number of question needed to be asked
 * @returns {array}  an array of questions, answers and other related data.
 * @description Fetches data from the Open Trivia database using the promise based Fetch API.
 */
//  https://opentdb.com/api.php?amount=10
const getTrivia = async () => {
  const response = await fetch("data.json");
  const data = await response.json();
  return data.results;
};

function* generator(arr) {
  for (item of arr) {
    yield item;
  }
}
/**
 *
 * @param {Generator} generate
 * @returns {array} Answers given for all questions
 * @description Generates a question from a generator and saves the answer to an array.
 */
const setQuestion = (generate) => {
  trivia = generate.next();
  if (trivia.value === undefined) {
    return answersGiven;
  }
  options = trivia.value.incorrect_answers;
  options.push(trivia.value.correct_answer);
  questionElement.innerHTML = trivia.value.question;

  for (answer of options) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.addEventListener("click", () => {
      answersGiven.push(event.target.innerHTML);
      while (answersContainer.firstChild) {
        answersContainer.removeChild(answersContainer.lastChild);
      }
      questionElement.innerHTML = "";
      if (!trivia.done) {
        setQuestion(generate);
      }
    });
    button.innerHTML = answer;
    answersContainer.appendChild(button);
  }
};

getTrivia()
  .then((trivia) => {
    setQuestion(generator(trivia));
  })
  .catch((error) => {
    console.log(error);
  });
