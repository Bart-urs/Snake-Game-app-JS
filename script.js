let direction = {x: 0, y: 0};
let keyPress = false;

window.addEventListener('keydown', e => {
    if (keyPress === false && e.key === 'ArrowLeft') {
        return;
    }
    keyPress = true;
    switch(e.key) {
        case 'ArrowUp':
            if (direction.y !== 1) direction = {x: 0, y: -1};
            break;
        case 'ArrowDown':
            if (direction.y !== -1) direction = {x: 0, y: 1};
            break;
        case 'ArrowLeft':
            if (direction.x !== 1) direction = {x: -1, y: 0};
            break;
        case 'ArrowRight':
            if (direction.x !== -1) direction = {x: 1, y: 0};
            break;
    }
});

const gameBoard = document.getElementById('game-board');
const gameBoardSize = 20;
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');

let highScore = localStorage.getItem('highScore') ? Number(localStorage.getItem('highScore')) : 0;
highScoreElement.innerText = 'High Score: ' + highScore;

let gameSpeed = 110;
let score = 0;
let snake = [
    {x: gameBoardSize / 2, y: gameBoardSize / 2},
    {x: gameBoardSize / 2 - 1, y: gameBoardSize / 2},
    {x: gameBoardSize / 2 - 2, y: gameBoardSize / 2}
];
let food = [null, null];

console.log("FOO!")

function saveHighScoreToLocalStorage(score) {
    console.log("Saving high score to local storage:", score)
    localStorage.setItem('highScore', score.toString());
}

function saveHighScoreToBackend(score) {
    console.log("(Not yet) Saving high score to HTTP backend:", score)
    // TODO????
}

const storages = [
    saveHighScoreToLocalStorage,
    saveHighScoreToBackend,
]

function saveHighScoreToAllStorages(score) {
    storages.forEach(save => save(score))
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        highScoreElement.innerText = 'High Score: ' + highScore;
        saveHighScoreToLocalStorage(highScore);
    }
}

function clearBoard() {
    while (gameBoard.firstChild) {
        gameBoard.firstChild.remove();
    }
}

function updateGame() {
    if (!keyPress) return;
    const head = { ...snake[0] };

    head.x += direction.x;
    head.y += direction.y;

    if (head.x < 1) head.x = gameBoardSize;
    if (head.y < 1) head.y = gameBoardSize;
    if (head.x > gameBoardSize) head.x = 1;
    if (head.y > gameBoardSize) head.y = 1;

    // Check if the snake is crossing itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        // If so, end the game
        updateHighScore();
        gameOver();
        return;
    }

    let ateFood = false;
    for (let i = 0; i < food.length; i++) {
        if (food[i] && food[i].x === head.x && food[i].y === head.y) {
            score += 10;
            scoreElement.innerText = 'Score: ' + score;
            generateFood(i);
            ateFood = true;
            break;
        }
    }

    if (!ateFood) {
        snake.pop();
    }

    snake.unshift(head);
}

function drawGame() {
    snake.forEach((segment, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add(index === 0 ? 'snake-head' : 'snake');
        gameBoard.appendChild(snakeElement);
    });
    for (let i = 0; i < food.length; i++) {
        if (food[i]) {
            const foodElement = document.createElement('div');
            foodElement.style.gridRowStart = food[i].y;
            foodElement.style.gridColumnStart = food[i].x;
            foodElement.classList.add('food');
            gameBoard.appendChild(foodElement);
        }
    }
}

function generateFood(index) {
    while (true) {
        const newFood = {
            x: Math.floor(Math.random() * gameBoardSize) + 1,
            y: Math.floor(Math.random() * gameBoardSize) + 1
        }

        if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            continue;
        } else {
            food[index] = newFood;
            break;
        }
    }
}

function gameOver() {
    let highScore = Number(localStorage.getItem('highScore'));
    if (!highScore || score > highScore) {
        highScore = score;
        highScoreElement.innerText = 'High Score: ' + highScore;
        localStorage.setItem('highScore', highScore.toString());
    }
    alert('Game Over! Your score is: ' + score);
    snake = [
        {x: gameBoardSize / 2, y: gameBoardSize / 2},
        {x: gameBoardSize / 2 - 1, y: gameBoardSize / 2},
        {x: gameBoardSize / 2 - 2, y: gameBoardSize / 2}
    ];
    direction = { x: 0, y: 0 };
    keyPress = false;
    score = 0;
    scoreElement.innerText = 'Score: ' + score;
    generateFood();
}

function main() {
    setTimeout(() => {
        clearBoard();
        updateGame();
        drawGame();
        main();
    }, gameSpeed);
}

generateFood(0);
generateFood(1);
updateHighScore();
main();
