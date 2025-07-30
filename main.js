'use strict'

var checkAnswerBtn, hideAnswerBtn, goodAnswerBtn, wrongAnswerBtn, drawCategoryBtn, drawQuestionBtn, startBtn, infoBtn, newGameBtn, buttons;
var categoryTxt, questionTxt, jackpotTxt, answerTxt, answerBox, info, categoryName, questionSrc, categoryId, teams;
var doneQuestions = [[], [], [], [], []];
var doneQuestionsLenght = 0, jackpot = 0;


const addButtons = document.querySelectorAll('.balance-add');
const subtractButtons = document.querySelectorAll('.balance-subtract');


const updateTeamBalance = (teamColor, newBalance) => {
    const balanceDisplay = document.querySelector(`.game__balance-field.game__balance-field--${teamColor}`);
    if (balanceDisplay) {
        balanceDisplay.innerText = newBalance;
    }
};

const addToBalance = (event) => {
    const button = event.target;
    const teamColor = Array.from(button.classList).find(className => className.startsWith('team-')).split('-')[1]; 
    const input = button.parentElement.querySelector('.balance-adjustment'); 
    const amount = parseInt(input.value);

    if (!isNaN(amount)) {
        const balanceDisplay = document.querySelector(`.game__balance-field.game__balance-field--${teamColor}`);
        const currentBalance = parseInt(balanceDisplay.innerText);
        const newBalance = currentBalance + amount;
        updateTeamBalance(teamColor, newBalance);
        input.value = ''; 
    }
};

const subtractFromBalance = (event) => {
    const button = event.target;
    const teamColor = Array.from(button.classList).find(className => className.startsWith('team-')).split('-')[1]; 
    const input = button.parentElement.querySelector('.balance-adjustment');
    const amount = parseInt(input.value);

    if (!isNaN(amount)) {
        const balanceDisplay = document.querySelector(`.game__balance-field.game__balance-field--${teamColor}`);
        const currentBalance = parseInt(balanceDisplay.innerText);
        if (amount <= currentBalance) {
            const newBalance = currentBalance - amount;
            updateTeamBalance(teamColor, newBalance);
            input.value = ''; 
        } else {
            alert("Nie można odjąć więcej niż aktualny stan konta.");
        }
    }
};


addButtons.forEach(button => {
    button.addEventListener('click', addToBalance);
});

subtractButtons.forEach(button => {
    button.addEventListener('click', subtractFromBalance);
});


const jackpotInput = document.getElementById('jackpotAdjustment');
const jackpotAddBtn = document.querySelector('.game__jackpot-add');
const jackpotSubtractBtn = document.querySelector('.game__jackpot-subtract');


const updateJackpotDisplay = (newAmount) => {
    jackpotDisplay.innerText = newAmount;
};

const addToJackpot = () => {
    const amount = parseInt(jackpotInput.value);
    if (!isNaN(amount)) {
        const currentJackpot = parseInt(jackpotDisplay.innerText);
        const newJackpot = currentJackpot + amount;
        updateJackpotDisplay(newJackpot);
        jackpotInput.value = ''; 
    }
};

const subtractFromJackpot = () => {
    const amount = parseInt(jackpotInput.value);
    if (!isNaN(amount)) {
        const currentJackpot = parseInt(jackpotDisplay.innerText);
        if (amount <= currentJackpot) {
            const newJackpot = currentJackpot - amount;
            updateJackpotDisplay(newJackpot);
            jackpotInput.value = ''; 
        } else {
            alert("Nie można odjąć więcej niż aktualna pula.");
        }
    }
};

jackpotAddBtn.addEventListener('click', addToJackpot);
jackpotSubtractBtn.addEventListener('click', subtractFromJackpot);

const newGame = () => {
    window.location.reload();
};

const hideInfo = () => {
    info.classList.add('start--hidden');
    startBtn.innerText = 'Wróć do gry';
    newGameBtn.classList.remove('game__btn--disabled');
};

const showInfo = () => {
    info.classList.remove('start--hidden');
};

const disableBtn = btn => {
    btn.disabled = true;
    btn.classList.add('game__btn--disabled');
};

const enableBtn = btn => {
    btn.disabled = false;
    btn.classList.remove('game__btn--disabled');
}; 

const disableFields = () => {
    for (let [a, b, c] of teams) {
        a.disabled = true;
        a.classList.add('game__auction-field--disabled');
    };
};

const enableFields = () => {
    for (let [a, b, c] of teams) {
        if (c > 0) {
            a.disabled = false;
            a.classList.remove('game__auction-field--disabled');
        };
    };
};

const showAnswer = () => {
    answerBox.classList.remove('answer--hidden');
    handleAnswerButtons();
};

const hideAnswer = () => {
    answerBox.classList.add('answer--hidden');
    if (drawQuestionBtn.classList.contains('game__btn--disabled')) {
        enableBtn(checkAnswerBtn);
    };
 };

const handleAnswerButtons = () => {
    if (((parseInt(teams[0][0].value) !== 0) || (parseInt(teams[1][0].value) !== 0) || (parseInt(teams[2][0].value) !== 0) || (parseInt(teams[3][0].value) !== 0)) && (!checkAnswerBtn.classList.contains('game__btn--disabled')) && drawQuestionBtn.classList.contains('game__btn--disabled')) {
        enableBtn(goodAnswerBtn);
        enableBtn(wrongAnswerBtn);
    } else {
        disableBtn(goodAnswerBtn);
        disableBtn(wrongAnswerBtn);
    };
};

const drawCategory = () => {
    setMaxInputValues();
    if (doneQuestionsLenght === 25) {
        answerTxt.innerText = "To już wszystkie pytania, które przygotowaliśmy.";
        hideAnswerBtn.addEventListener('click', newGame);
        hideAnswerBtn.innerText = "Nowa gra";
        showAnswer();
        disableBtn(drawCategoryBtn);
        disableBtn(checkAnswerBtn);
        return;
    }
    
    let inputCategory = document.getElementById("categoryInput");
    if (!inputCategory) {
        console.error("categoryInput element not found.");
        return;
    }
    let categoryValue = inputCategory.value.trim();
    
    fetch("categories.json")
        .then(res => res.json())
        .then(data => {
            const selectedCategory = data.find(cat => cat.categorySrc.toLowerCase() === categoryValue.toLowerCase());
            
            if (!selectedCategory) {
                answerTxt.innerText = "Nie znaleziono kategorii. Spróbuj ponownie.";
                return;
            }
            
            categoryId = selectedCategory.categoryId;
            
            if (!doneQuestions[categoryId]) {
                doneQuestions[categoryId] = [];
            }
            
            if (doneQuestions[categoryId].length === 5) {
                answerTxt.innerText = "Wszystkie pytania w tej kategorii zostały już użyte.";
                return;
            }
            
            categoryTxt.innerText = selectedCategory.categoryName;
            questionSrc = `${selectedCategory.categorySrc}.json`;
            
            if (!teams || teams.length === 0) {
                console.error("Teams array is not properly initialized.");
                return;
            }
            
            for (let [a, b, c] of teams) {
                if (a) a.value = 200;
                bid();
            }
            bid();
            disableBtn(drawCategoryBtn);
            enableFields();
        })
        .catch(error => {
            console.error("Error fetching categories.json:", error);
        });
};

let recursionCount = 0; 

const attemptDraw = (recursionCount) => {
    console.log("categoryId:", categoryId, "questionSrc:", questionSrc); 

    fetch(questionSrc)
        .then(res => {
            if (!res.ok) {
                console.error(`HTTP error! status: ${res.status}, questionSrc: ${questionSrc}`);
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                console.error("Error: Empty or invalid question data. data:", data, "questionSrc:", questionSrc);
                questionTxt.innerText = "Brak dostępnych pytań w tej kategorii.";
                return;
            }

            const questionIdRandom = Math.floor(Math.random() * data.length);
            const selectedQuestion = data[questionIdRandom];

            if (!selectedQuestion) {
                console.error("Error: selectedQuestion is undefined. questionIdRandom:", questionIdRandom, "data:", data);
                questionTxt.innerText = "Błąd podczas ładowania pytań.";
                return;
            }

            if (doneQuestions[categoryId].includes(selectedQuestion.questionId)) {
                console.log("Question already used, retrying. questionId:", selectedQuestion.questionId, "recursionCount:", recursionCount);
                recursionCount++;
                if (recursionCount < 10) {
                    attemptDraw(recursionCount);
                } else {
                    console.error("Error: Could not find a unique question after 10 attempts. categoryId:", categoryId, "questionSrc:", questionSrc);
                    questionTxt.innerText = "Brak dostępnych unikalnych pytań w tej kategorii.";
                }
                return;
            }

            questionTxt.innerHTML = '';

            if (selectedQuestion.questionText) {
                const textNode = document.createTextNode(selectedQuestion.questionText);
                questionTxt.appendChild(textNode);
            }

            if (selectedQuestion.imagePath) {
                const image = document.createElement('img');
                image.src = selectedQuestion.imagePath;
                image.style.maxWidth = '500px';
                image.style.maxHeight = '500px';
                questionTxt.appendChild(document.createElement('br'));
                questionTxt.appendChild(image);
            }

            answerTxt.innerText = selectedQuestion.questionAnswer;
            doneQuestions[categoryId].push(selectedQuestion.questionId);
            doneQuestionsLenght++;

            console.log("Question loaded successfully. questionId:", selectedQuestion.questionId);
        })
        .catch(error => {
            console.error("Error fetching or processing question data:", error, "questionSrc:", questionSrc);
            questionTxt.innerText = "Błąd podczas ładowania pytań.";
        });
};

const drawQuestion = () => {
    let maxBids = teams.map(team => parseInt(team[0].value));
    maxBids.sort((a, b) => b - a);

    if (maxBids[0] === maxBids[1]) {
        answerTxt.innerText = "Aby wygrać licytację, musisz przebić swojego przeciwnika.";
        showAnswer();
    } else {
        disableBtn(drawQuestionBtn);
        enableBtn(checkAnswerBtn);
        disableFields();
        recursionCount = 0;
        attemptDraw(recursionCount);
    }
};

const clearJackpotBtn = document.querySelector('.game__clear-jackpot-btn');
const jackpotDisplay = document.querySelector('.game__jackpot');

const showClearJackpotButton = () => {
    if (clearJackpotBtn) {
        clearJackpotBtn.classList.remove('game__btn--hidden');
    }
};

const hideClearJackpotButton = () => {
    if (clearJackpotBtn) {
        clearJackpotBtn.classList.add('game__btn--hidden');
    }
};

const clearJackpot = () => {
    if (jackpotDisplay) {
        jackpotDisplay.innerText = '0';
    }
    hideClearJackpotButton();
};

if (clearJackpotBtn) {
    clearJackpotBtn.addEventListener('click', clearJackpot);
} else {
    console.error("Clear Jackpot button not found in the DOM.");
}


const checkLose = () => {
    for (let [a, b, c] of teams) {
        if (c == 0) {
            a.classList.add('game__auction-field--disabled');
            a.disabled = true;
            b.classList.add('game__auction-field--disabled');
        };
    };
};

const checkWin = () => {
    for (let [a, b, c] of teams) {
        if (c === 20000) {
            hideAnswerBtn.innerText = "Nowa gra"
            answerTxt.innerText = "Koniec gry:)"
            hideAnswerBtn.addEventListener('click', newGame);
            disableBtn(drawCategoryBtn);
            showAnswer();
        };
    };
};

const checkFields = () => {
    for (let [a, b, c] of teams) {
        let check = parseInt(a.value);
        let checkDbl = parseFloat(a.value);
        if (Number.isNaN(check)) {
            a.value = 200;
        } else if (parseInt(a.value) > c) {
            a.value = c;
        } else if (!Number.isInteger(checkDbl)) {
            if (checkDbl < 200) {
                a.value = 200;
            } else {
                a.value = Math.round(checkDbl);
            };
        };
    }; 
};

const setMaxInputValues = () => {
    for (let [a, b, c] of teams) {
        a.setAttribute('max', c);
    };
};

const goodAnswer = () => {
    let max = 0;
    let index;
    for (let i = 0; i < teams.length; i++) {
        if (parseInt(teams[i][0].value) > max) {
            max = parseInt(teams[i][0].value);
            index = i;
        };
    };
    teams[index][2] = parseInt(teams[index][1].innerText) + parseInt(jackpotTxt.innerText);
    teams[index][1].innerText = teams[index][2];
    for (let [a, b, c] of teams) {
        c = parseInt(b.innerText);
        a.value = 0;
    };
    jackpot = 0;
    jackpotTxt.innerText = jackpot;
    questionTxt.innerText = '';
    hideAnswer();
    enableBtn(drawCategoryBtn);
    disableBtn(checkAnswerBtn);
    refreshTeams();
    handleAnswerButtons();
    disableFields();
    checkLose();
    checkWin();

};

'use strict'

const wrongAnswer = () => {
    refreshTeams();
    for (let [a, b, c] of teams) {
        a.value = 0;
        c = parseInt(b.innerText);
        b.innerText = c;
    };
    jackpot = parseInt(jackpotTxt.innerText);
    questionTxt.innerText = '';
    refreshTeams();
    hideAnswer();
    enableBtn(drawCategoryBtn);
    disableBtn(checkAnswerBtn);
    disableFields();
    checkLose();
    checkWin();
    handleAnswerButtons();
};

const bid = () => {
    checkFields();
    let add = 0 + jackpot;
    for (let [a, b, c] of teams) {
            b.innerText = c - parseInt(a.value)
            add += parseInt(a.value);
    };
    jackpotTxt.innerText = add;
    enableBtn(drawQuestionBtn);
};

const refreshTeams = () => {
    teams = [
        [document.querySelector('.game__auction-field--blue'), document.querySelector('.game__balance-field--blue'), parseInt(document.querySelector('.game__balance-field--blue').innerText)],
        [document.querySelector('.game__auction-field--green'), document.querySelector('.game__balance-field--green'), parseInt(document.querySelector('.game__balance-field--green').innerText)],
        [document.querySelector('.game__auction-field--yellow'), document.querySelector('.game__balance-field--yellow'), parseInt(document.querySelector('.game__balance-field--yellow').innerText)],
        [document.querySelector('.game__auction-field--red'), document.querySelector('.game__balance-field--red'), parseInt(document.querySelector('.game__balance-field--red').innerText)]
    ];
};

const prepareDOMElements = () => {
    drawCategoryBtn = document.querySelector('.game__category-btn');
    drawQuestionBtn = document.querySelector('.game__question-btn');
    checkAnswerBtn = document.querySelector('.game__question-btn-answer');
    hideAnswerBtn = document.querySelector('.answer__btn');
    newGameBtn = document.querySelector('.start__new-game-btn');
    goodAnswerBtn = document.querySelector('.game__good-answer-btn');
    wrongAnswerBtn = document.querySelector('.game__wrong-answer-btn');
    startBtn = document.querySelector('.start__play-btn');
    buttons = document.querySelectorAll('.game__btn')
    infoBtn = document.querySelector('.header__info-btn');
    answerBox = document.querySelector('.answer');
    categoryTxt = document.querySelector('.game__category');
    jackpotTxt = document.querySelector('.game__jackpot');
    questionTxt = document.querySelector('.game__question');
    answerTxt = document.querySelector('.answer__text');
    info = document.querySelector('.start')
    
    refreshTeams(); // Initialize teams here
};

const prepareDOMEvents = () => {
    checkAnswerBtn.addEventListener('click', showAnswer);
    hideAnswerBtn.addEventListener('click', hideAnswer);
    drawCategoryBtn.addEventListener('click', drawCategory);
    drawQuestionBtn.addEventListener('click', drawQuestion);
    goodAnswerBtn.addEventListener('click', goodAnswer);
    wrongAnswerBtn.addEventListener('click', wrongAnswer);
    startBtn.addEventListener('click', hideInfo);
    infoBtn.addEventListener('click', showInfo);
    newGameBtn.addEventListener('click', newGame);
    for (let [a, b, c] of teams) {
        a.addEventListener('change', bid);
        a.value = 0;
    };
    for (let [a, b, c] of teams) {
        console.log("Adding event listener to:", a); 
        a.addEventListener('change', bid);
        a.value = 0;
    };
    handleAnswerButtons();
};

const main = () => {
    prepareDOMElements();
    prepareDOMEvents();
};

document.addEventListener('DOMContentLoaded', main);