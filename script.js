let direction = {x: 0, y: 0};
let keyPress = false;
let leaderboard = localStorage.getItem('leaderboard') ? JSON.parse(localStorage.getItem('leaderboard')) : [];
console.log(typeof leaderboard); // should print "object"
console.log(Array.isArray(leaderboard)); // should print "true"
console.log(leaderboard); // should print the array
const scoresList = document.getElementById('scores-list');

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

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        highScoreElement.innerText = 'High Score: ' + highScore;
        localStorage.setItem('highScore', highScore.toString());
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
    updateLeaderboard(score);

    snake = [
        {x: gameBoardSize / 2, y: gameBoardSize / 2},
        {x: gameBoardSize / 2 - 1, y: gameBoardSize / 2},
        {x: gameBoardSize / 2 - 2, y: gameBoardSize / 2}
    ];
    direction = { x: 0, y: 0 };
    keyPress = false;
    score = 0;
    scoreElement.innerText = 'Score: ' + score;
    generateFood(0);
    generateFood(1);

    document.getElementById('end-screen').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
    displayLeaderboard();

    console.log('End screen display style:', document.getElementById('end-screen').style.display);
    console.log('End screen element:', document.getElementById('end-screen'));
}

document.getElementById('restart-button').addEventListener('click', function() {
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Reset game state
    score = 0;
    scoreElement.innerText = 'Score: ' + score;
    snake = [
        {x: gameBoardSize / 2, y: gameBoardSize / 2},
        {x: gameBoardSize / 2 - 1, y: gameBoardSize / 2},
        {x: gameBoardSize / 2 - 2, y: gameBoardSize / 2}
    ];
    direction = { x: 0, y: 0 };
    keyPress = false;
    generateFood(0);
    generateFood(1);
});

function displayLeaderboard() {
    scoresList.innerHTML = '';
    console.log('Scores list element:', scoresList);
    leaderboard.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `Player ${index + 1}: ${score}`;
        scoresList.appendChild(li);
    });
}

function updateLeaderboard(score) {
    leaderboard.push(score);
    leaderboard.sort((a, b) => b - a);
    leaderboard = leaderboard.slice(0, 10); // Keep only top 10 scores
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
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