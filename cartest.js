const startButton = document.querySelector(".start-btn");
const beginning = document.querySelector(".beginning");
const container = document.querySelector(".container");
const previousButton = document.querySelector("previous-btn");
const nextButton = document.querySelector("next-btn");

startButton.addEventListener("click", () => {
  start();
});

let allQuestions;

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
  num = 1;
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
              <input type="radio" id="${allQuestions[num].answers[0].id}" name="question${current}" value="${allQuestions[num].answers[0].text}" />
              <label for="${allQuestions[num].answers[0].id}">${allQuestions[num].answers[0].text}</label>
            </div>
            <div class="row">
              <input type="radio" id="${allQuestions[num].answers[1].id}" name="question${current}" value="${allQuestions[num].answers[1].text}" />
              <label for="${allQuestions[num].answers[1].id}">${allQuestions[num].answers[1].text}</label>
            </div>
            <div class="row">
              <input type="radio" id="${allQuestions[num].answers[2].id}" name="question${current}" value="${allQuestions[num].answers[2].text}" />
              <label for="${allQuestions[num].answers[2].id}">${allQuestions[num].answers[2].text}</label>
            </div>
            <div class="row">
              <input type="radio" id="${allQuestions[num].answers[3].id}" name="question${current}" value="${allQuestions[num].answers[3].text}" />
              <label for="${allQuestions[num].answers[3].id}">${allQuestions[num].answers[3].text}</label>
            </div>
          </form>
        </div>
  `;
  container.innerHTML = script;
};

const start = () => {
  beginning.classList.add("hide");
  container.classList.remove("hide");
  const arrayOfNumbers = generateArrayOfNumbers();
  let currentQuestion = 1;
  displayQuestion(arrayOfNumbers[0], currentQuestion);
};

const app = () => {
  fetchData().then((questions) => {
    allQuestions = questions;
  });
};

app();
