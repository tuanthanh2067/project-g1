const startButton = document.querySelector(".start-btn");
const beginning = document.querySelector(".beginning");
const container = document.querySelector(".container");
const previousButton = document.querySelector(".previous-btn");
const nextButton = document.querySelector(".next-btn");
const numOfCurrent = document.querySelector("#current-question");
const controlButtons = document.querySelector(".control-buttons");
const smallWindow = document.querySelector(".small-window");
const allSections = document.querySelectorAll(".section");
const submitButton = document.querySelector(".submit-btn");
const answeredQuestions = document.querySelectorAll(".answered-question");
const mixedContainer = document.querySelector(".mixed-container");
const qnaContainer = document.querySelector(".qna-container");
const brandName = document.querySelector(".brand-name");
const returnBtn = document.querySelector(".return");
const historyBtn = document.querySelector(".history-btn");
const historyOverlay = document.querySelector(".history-overlay");
const historyPopup = document.querySelector(".history-popup");
const closeBtn = document.querySelector(".close-btn");
const historyContainer = document.querySelector(".history-container");

let allQuestions;
let currentQuestion = 1;
let arrayOfNumbers;
let userAnswers;
let finalAnswersForAllQuestions;
let tempNumForSmallWindow;

let arrayOfNumbersFromLocal;
let userAnswersFromLocal;
let finalAnswersForAllQuestionsFromLocal;
let datesFromLocal;

startButton.addEventListener("click", () => {
  start();
});

nextButton.addEventListener("click", () => {
  nextFunction();
});

previousButton.addEventListener("click", () => {
  previousFunction();
});

numOfCurrent.addEventListener("click", () => {
  smallWindow.classList.toggle("active");
  const input = document.querySelector("input");
  if (input.name.length === 2) {
    tempNumForSmallWindow = parseInt(input.name[1]);
  } else {
    tempNumForSmallWindow = parseInt(input.name[1] + input.name[2]);
  }
});

submitButton.addEventListener("click", () => {
  const previousAnswer = saveUserAnswer();
  userAnswers[currentQuestion - 1] = previousAnswer;
  beginning.classList.add("hide");
  container.classList.add("hide");
  controlButtons.classList.add("hide");
  mixedContainer.classList.remove("hide");
  renderScore();
  renderCorrectAnswers();
  colorCorrectAndWrongAnswers();
  saveLocalStorage();
  loadLocalStorage();
});

const mainHome = () => {
  beginning.classList.remove("hide");
  container.classList.add("hide");
  controlButtons.classList.add("hide");
  mixedContainer.classList.add("hide");
};

brandName.addEventListener("click", mainHome);
returnBtn.addEventListener("click", mainHome);

historyBtn.addEventListener("click", () => {
  historyOverlay.classList.add("active");
  historyPopup.classList.add("active");
  renderHistory();
});

closeBtn.addEventListener("click", () => {
  historyOverlay.classList.remove("active");
  historyPopup.classList.remove("active");
});

historyOverlay.addEventListener("click", (e) => {
  if (e.target.classList.contains("history-overlay")) {
    historyOverlay.classList.remove("active");
    historyPopup.classList.remove("active");
  }
});

const fetchData = async () => {
  try {
    const link = "./json/quizzes.json";
    let result = await fetch(link);
    let data = await result.json();

    let questions = data.map((one) => {
      const { question, image, number, answers, correct } = one;
      return { question, image, number, answers, correct };
    });
    return questions;
  } catch (error) {
    console.log(error);
  }
};

const generateArrayOfNumbers = () => {
  let array = [];

  // generate 0->76 20 times or more if there is any duplicates
  do {
    let existed;
    let num = Math.floor(Math.random() * 77);
    do {
      existed = false;
      for (let i = 0; i < array.length && !existed; i++) {
        if (num === array[i]) existed = true;
      }
      if (existed === true) {
        num = Math.floor(Math.random() * 77);
      }
    } while (existed === true);
    array.push(num);
  } while (array.length < 20);

  // generate 77->199 20 times or more if there is any duplicates
  do {
    let existed;
    const max = 199;
    const min = 77;
    let num = Math.floor(Math.random() * (max - min + 1) + min);
    do {
      existed = false;
      for (let i = 0; i < array.length && !existed; i++) {
        if (num === array[i]) existed = true;
      }
      if (existed === true) {
        num = Math.floor(Math.random() * (max - min + 1) + min);
      }
    } while (existed === true);
    array.push(num);
  } while (array.length < 40);

  return array;
};

const displayQuestion = (num, current) => {
  // use num as the question number (0 -> 199)
  // use variable allQuestions[num]
  let script;
  if (allQuestions[num].question === "") {
    script = `
        <div class="question-box">
          <div class="question">
            <div class="question-number">${current}.</div>
          </div>
          <img class="question-img" src="${allQuestions[num].image}" alt="" />
        </div>
  `;
  } else {
    script = `
        <div class="question-box">
          <div class="question">
            <div class="question-number">${current}.</div>
            <h4>${allQuestions[num].question}</h4>
          </div>
        </div>
  `;
  }
  script += `
        <div class="answer-buttons">
          <form action="">
            <div class="row">
              <input type="radio" id="${allQuestions[num].answers[0].id}" name="q${current}" value="${allQuestions[num].answers[0].text}" />
              <label for="${allQuestions[num].answers[0].id}">${allQuestions[num].answers[0].text}</label>
            </div>
            <div class="row">
              <input type="radio" id="${allQuestions[num].answers[1].id}" name="q${current}" value="${allQuestions[num].answers[1].text}" />
              <label for="${allQuestions[num].answers[1].id}">${allQuestions[num].answers[1].text}</label>
            </div>
            <div class="row">
              <input type="radio" id="${allQuestions[num].answers[2].id}" name="q${current}" value="${allQuestions[num].answers[2].text}" />
              <label for="${allQuestions[num].answers[2].id}">${allQuestions[num].answers[2].text}</label>
            </div>
            <div class="row">
              <input type="radio" id="${allQuestions[num].answers[3].id}" name="q${current}" value="${allQuestions[num].answers[3].text}" />
              <label for="${allQuestions[num].answers[3].id}">${allQuestions[num].answers[3].text}</label>
            </div>
          </form>
        </div>
  `;
  container.innerHTML = script;
};

const start = () => {
  arrayOfNumbers = [];
  finalAnswersForAllQuestions = [];
  currentQuestion = 1;
  userAnswers = Array(40).fill(1);
  beginning.classList.add("hide");
  container.classList.remove("hide");
  controlButtons.classList.remove("hide");
  arrayOfNumbers = generateArrayOfNumbers();
  for (let i = 0; i < 40; i++) {
    finalAnswersForAllQuestions.push(allQuestions[arrayOfNumbers[i]].correct);
  }
  displayQuestion(arrayOfNumbers[0], currentQuestion);
  for (let i = 0; i < 40; i++) {
    answeredQuestions[i].innerText = "Not Answered";
  }
  putCheckFunction(1);
  numOfCurrent.innerText = "1";
  nextButton.classList.remove("hide");
  submitButton.classList.add("hide");
};

const nextFunction = () => {
  const previousAnswer = saveUserAnswer();
  userAnswers[currentQuestion - 1] = previousAnswer;
  updateSectionInSmallWindow(previousAnswer, currentQuestion);
  currentQuestion++;
  if (currentQuestion === 40) {
    nextButton.classList.add("hide");
    submitButton.classList.remove("hide");
  }
  displayQuestion(arrayOfNumbers[currentQuestion - 1], currentQuestion);
  putCheckFunction(currentQuestion - 1);
  numOfCurrent.innerText = currentQuestion;
};

const previousFunction = () => {
  if (nextButton.classList.contains("hide")) {
    nextButton.classList.remove("hide");
    submitButton.classList.add("hide");
  }
  const previousAnswer = saveUserAnswer();
  userAnswers[currentQuestion - 1] = previousAnswer;
  currentQuestion--;
  if (currentQuestion < 1) {
    currentQuestion = 1;
    updateSectionInSmallWindow(previousAnswer, currentQuestion);
  } else {
    updateSectionInSmallWindow(previousAnswer, currentQuestion + 1);
    displayQuestion(arrayOfNumbers[currentQuestion - 1], currentQuestion);
    putCheckFunction(currentQuestion - 1);
    numOfCurrent.innerText = currentQuestion;
  }
};

allSections.forEach((section, index) => {
  section.addEventListener("click", () => {
    // question number = index + 1.
    const previousAnswer = saveUserAnswer();
    // find which question we are in then save it to userAnswers.
    currentQuestion = index + 1;

    if (currentQuestion === 40) {
      nextButton.classList.add("hide");
      submitButton.classList.remove("hide");
    } else {
      nextButton.classList.remove("hide");
      submitButton.classList.add("hide");
    }
    userAnswers[tempNumForSmallWindow - 1] = previousAnswer;
    updateSectionInSmallWindow(previousAnswer, tempNumForSmallWindow);
    smallWindow.classList.remove("active");
    displayQuestion(arrayOfNumbers[index], index + 1);
    putCheckFunction(index);
    numOfCurrent.innerText = index + 1;
  });
});

const saveUserAnswer = () => {
  const radioButtons = document.querySelectorAll("input");
  let choice = 0;
  radioButtons.forEach((button) => {
    if (button.checked === true) {
      choice = button.id;
    }
  });
  return parseInt(choice);
};

const putCheckFunction = (currentQuestion) => {
  const userChoice = userAnswers[currentQuestion];
  if (userChoice !== 0) {
    const radioButtons = document.querySelectorAll("input");
    radioButtons[userChoice - 1].checked = true;
  }
};

const updateSectionInSmallWindow = (num, previousQuestion) => {
  // num will be 0 1 2 3 4
  // previous Question: the number of the previous question that user just answered
  if (num !== 0) {
    answeredQuestions[previousQuestion - 1].innerText = "Answered";
  }
};

const renderScore = () => {
  const yourAnsweredQuestion = document.querySelector(
    ".your-answered-questions"
  );
  const yourCorrectAnswers = document.querySelector(".your-total-correct");
  const yourScore = document.querySelector(".your-score");
  const yourPercent = document.querySelector(".your-percent");
  let answeredQuestions = 0;
  let correctAnswers = 0;
  for (let i = 0; i < 40; i++) {
    if (userAnswers[i] !== 0) {
      answeredQuestions++;
    }
    if (userAnswers[i] === finalAnswersForAllQuestions[i]) {
      correctAnswers++;
    }
  }
  yourAnsweredQuestion.innerText = answeredQuestions;
  yourCorrectAnswers.innerText = correctAnswers;
  const score = 0.25 * correctAnswers;
  yourScore.innerText = score;
  const percent = score * 10;
  yourPercent.innerText = percent;
};

const renderCorrectAnswers = () => {
  let script = "";
  for (let i = 0; i < 40; i++) {
    if (userAnswers[i] !== 0) {
      script += `
      <div class="qna-section">
            <div class="question-num"  >
              <h3>${i + 1}. </h3>
              <h3>${allQuestions[arrayOfNumbers[i]].question}</h3>
              <img src="${allQuestions[arrayOfNumbers[i]].image}" alt="" />
            </div>
            <h4>
              You selected: ${
                allQuestions[arrayOfNumbers[i]].answers[userAnswers[i] - 1].text
              }.
            </h4>
            <h4>Correct answer: ${
              allQuestions[arrayOfNumbers[i]].answers[
                finalAnswersForAllQuestions[i] - 1
              ].text
            }</h4>
      </div>
      `;
    } else {
      script += `
      <div class="qna-section">
            <div class="question-num"  >
              <h3>${i + 1}. </h3>
              <h3>${allQuestions[arrayOfNumbers[i]].question}</h3>
              <img src="${allQuestions[arrayOfNumbers[i]].image}" alt="" />
            </div>
            <h4>
              You selected:
            </h4>
            <h4>Correct answer: ${
              allQuestions[arrayOfNumbers[i]].answers[
                finalAnswersForAllQuestions[i] - 1
              ].text
            }</h4>
      </div>
      `;
    }
  }
  qnaContainer.innerHTML = script;
};

const colorCorrectAndWrongAnswers = () => {
  const qnaSection = document.querySelectorAll(".qna-section");
  for (let i = 0; i < 40; i++) {
    if (userAnswers[i] === finalAnswersForAllQuestions[i]) {
      qnaSection[i].children[1].style.color = "green";
      qnaSection[i].children[2].style.color = "green";
    } else {
      qnaSection[i].children[1].style.color = "red";
      qnaSection[i].children[2].style.color = "red";
    }
  }
};

const loadLocalStorage = () => {
  if (localStorage.getItem("userAnswers") === null) {
    arrayOfNumbersFromLocal = [];
    userAnswersFromLocal = [];
    finalAnswersForAllQuestionsFromLocal = [];
    datesFromLocal = [];
  } else {
    arrayOfNumbersFromLocal = JSON.parse(
      localStorage.getItem("arrayOfNumbers")
    );
    userAnswersFromLocal = JSON.parse(localStorage.getItem("userAnswers"));
    finalAnswersForAllQuestionsFromLocal = JSON.parse(
      localStorage.getItem("finalAnswersForAllQuestions")
    );
    datesFromLocal = JSON.parse(localStorage.getItem("dates"));
  }
};

const saveLocalStorage = () => {
  userAnswersFromLocal.push(userAnswers);
  finalAnswersForAllQuestionsFromLocal.push(finalAnswersForAllQuestions);
  arrayOfNumbersFromLocal.push(arrayOfNumbers);
  datesFromLocal.push(getCurrentDate());
  localStorage.setItem("userAnswers", JSON.stringify(userAnswersFromLocal));
  localStorage.setItem(
    "finalAnswersForAllQuestions",
    JSON.stringify(finalAnswersForAllQuestionsFromLocal)
  );
  localStorage.setItem(
    "arrayOfNumbers",
    JSON.stringify(arrayOfNumbersFromLocal)
  );
  localStorage.setItem("dates", JSON.stringify(datesFromLocal));
};

const getCurrentDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  today = yyyy + "/" + mm + "/" + dd;
  return today;
};

const renderHistory = () => {
  let script = "";
  if (userAnswersFromLocal.length >= 1) {
    for (let i = 0; i < userAnswersFromLocal.length; i++) {
      let correct = 0;
      for (let j = 0; j < 40; j++) {
        if (
          userAnswersFromLocal[i][j] ===
          finalAnswersForAllQuestionsFromLocal[i][j]
        )
          correct++;
      }
      const percent = ((correct / 40) * 100).toFixed(2);
      script += `
        <div class="history">
          <h5>${datesFromLocal[i]}</h5>
          <h5>${percent}%</h5>
          <button class="select-history">Select</button>
        </div>
      `;
    }
  }
  historyContainer.innerHTML = script;
};

const app = () => {
  fetchData().then((questions) => {
    allQuestions = questions;
  });
  loadLocalStorage();
};

app();
