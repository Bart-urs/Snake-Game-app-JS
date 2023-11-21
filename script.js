let direction = {x: 0, y: 0};
let keyPress = false;
// localStorage.removeItem('leaderboard');
let leaderboard = localStorage.getItem('leaderboard') ? JSON.parse(localStorage.getItem('leaderboard')) : [];
console.log("Leaderboard at start:", leaderboard);
const scoresList = document.getElementById('scores-list');
let finalScore = 0;

window.addEventListener('keydown', e => {
    // Sprawdź, czy wyświetlany jest ekran końcowy
    if (document.getElementById('end-screen').style.display === 'block') {
        if (e.key === 'Enter') {
            // Tutaj możemy umieścić kod, który ma się wykonać po wciśnięciu klawisza Enter
            document.getElementById('restart-button').click();
        }
        // Zatrzymaj dalsze przetwarzanie zdarzenia
        return;
    }
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return;
    }
    // Sprawdź, czy wyświetlany jest ekran końcowy
    if (document.getElementById('end-screen').style.display === 'block') {
        if (e.key === 'Enter') {
            // Tutaj możemy umieścić kod, który ma się wykonać po wciśnięciu klawisza Enter
            document.getElementById('restart-button').click();
        }
        // Zatrzymaj dalsze przetwarzanie zdarzenia
        return;
    }

    // Check if the name input form is displayed
    if (document.getElementById('name-input').style.display === 'block') {
        // Zatrzymaj dalsze przetwarzanie zdarzenia
        return;
    }

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
    if (direction.x !== 0 || direction.y !== 0) { // Add this line
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            // If so, end the game
            updateHighScore();
            gameOver();
            return;
        }
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

    finalScore = score; // Store the final score before resetting

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

    document.getElementById('name-input').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';

    document.getElementById('player-name').focus();
}

document.getElementById('restart-button').addEventListener('click', function() {
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

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
    leaderboard.forEach((entry) => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score}`;
        scoresList.appendChild(li);
    });
}

function updateLeaderboard(score) {
    console.log("Updating leaderboard with score:", score);
    var playerName = document.getElementById('player-name').value; // Get the player name here
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    console.log("Leaderboard saved to localStorage:", JSON.parse(localStorage.getItem('leaderboard')));
    document.getElementById('player-name').value = ''; // Clear the input field
    console.log("Leaderboard after update:", leaderboard);
}

document.getElementById('name-form').addEventListener('submit', function(event) {
    var playerName = document.getElementById('player-name').value;
    if (playerName.trim() === '') { // Sprawdzamy, czy input jest pusty
        event.preventDefault(); // Zapobiegamy domyślnej akcji
    } else {
        event.preventDefault();
        updateLeaderboard(finalScore);
        displayLeaderboard();
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('end-screen').style.display = 'block';
    }
});

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