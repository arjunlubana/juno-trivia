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
  const response = await fetch("https://opentdb.com/api.php?amount=10");
  const data = await response.json();
  return data.results;
};

// A generator to send questions one at a time.
function* generator(arr) {
  for (item of arr) {
    yield item;
  }
}
/**
 *
 * @param {Generator} generate
 * @returns {array} answers given to all questions asked.
 * @description Generates a question from a generator ```generate``` and saves the answer to an array.
 */
const setQuestion = (generate) => {
  trivia = generate.next();
  if (trivia.value === undefined) {
    return answersGiven;
  }
  // Compiles the answers into an array
  options = trivia.value.incorrect_answers;
  options.push(trivia.value.correct_answer);
  correctAnswers.push(trivia.value.correct_answer)

  // Renders the question to the DOM
  questionElement.innerHTML = trivia.value.question;

  // Renders the answer options of the question to the DOM
  for (answer of options) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerHTML = answer;
    answersContainer.appendChild(button);

    // After answering the question.
    // Clears the previous question and loads the next to the DOM.
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
  }
};

getTrivia()
  .then((trivia) => {
    setQuestion(generator(trivia));
    console.log(answersGiven);
  })
  .catch((error) => {
    console.log(error);
  });

