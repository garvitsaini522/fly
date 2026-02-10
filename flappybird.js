const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const jumpSound = document.getElementById("jumpSound");
const hitSound = document.getElementById("hitSound");

canvas.width = 400;
canvas.height = 600;

let bird, pipes, frame, score, gameRunning;
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.innerText = "High Score: " + highScore;

function resetGame() {
    bird = { x: 50, y: 150, width: 30, height: 30, gravity: 0.3, lift: -10, velocity: 0 };

    pipes = [];
    frame = 0;
    score = 0;
    gameRunning = true;
    gameOverScreen.classList.add("hidden");
    scoreDisplay.innerText = "Score: 0";
}

document.addEventListener("keydown", jump);
canvas.addEventListener("touchstart", jump);

function jump() {
    if (!gameRunning) return;
    bird.velocity = bird.lift;
    jumpSound.play();
}

startBtn.addEventListener("click", () => { resetGame(); update(); });
restartBtn.addEventListener("click", () => { resetGame(); update(); });

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, 60, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 60, pipe.bottom);
    });
}

function checkCollision(pipe) {
    if (bird.x < pipe.x + 60 &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
        return true;
    }
    return false;
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Animated background clouds
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc((frame % 400), 80, 20, 0, Math.PI * 2);
    ctx.fill();

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (frame % 90 === 0) {
        let top = Math.random() * 200 + 50;
        let bottom = canvas.height - top - 150;
        pipes.push({ x: canvas.width, top, bottom });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (checkCollision(pipe) || bird.y > canvas.height || bird.y < 0) {
            gameRunning = false;
            hitSound.play();
            gameOverScreen.classList.remove("hidden");

            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
                highScoreDisplay.innerText = "High Score: " + highScore;
            }
        }

        if (pipe.x === bird.x) {
            score++;
            scoreDisplay.innerText = "Score: " + score;
        }
    });

    drawBird();
    drawPipes();

    frame++;
    requestAnimationFrame(update);
}
