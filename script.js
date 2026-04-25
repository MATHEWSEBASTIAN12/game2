const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

let player = { speed: 5, score: 0, start: false };
let keys = {};

let car;

/* SHOW ALERT */
alert("Better to play in laptops for best experience!");

/* START GAME */
startBtn.addEventListener("click", startGame);

function startGame() {
    gameArea.innerHTML = "";
    player.start = true;
    player.score = 0;
    player.speed = 5;

    startBtn.style.display = "none";

    /* Create car */
    car = document.createElement("div");
    car.classList.add("car");
    car.style.left = "200px";
    gameArea.appendChild(car);

    /* Road lines */
    for (let i = 0; i < 6; i++) {
        let line = document.createElement("div");
        line.classList.add("line");
        line.style.top = (i * 150) + "px";
        gameArea.appendChild(line);
    }

    /* Enemy cars */
    for (let i = 0; i < 3; i++) {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.style.left = Math.floor(Math.random() * 400) + "px";
        enemy.style.top = (i * -250) + "px";
        gameArea.appendChild(enemy);
    }

    window.requestAnimationFrame(gamePlay);
}

/* KEY EVENTS */
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

/* MOVE LINES */
function moveLines() {
    document.querySelectorAll(".line").forEach(line => {
        let top = parseInt(line.style.top);
        top += player.speed;

        if (top > 700) top = -150;
        line.style.top = top + "px";
    });
}

/* MOVE ENEMIES */
function moveEnemies() {
    document.querySelectorAll(".enemy").forEach(enemy => {
        let top = parseInt(enemy.style.top);
        top += player.speed;

        if (top > 700) {
            top = -250;
            enemy.style.left = Math.floor(Math.random() * 400) + "px";
            player.score++;
        }

        enemy.style.top = top + "px";

        if (isCollide(car, enemy)) {
            endGame();
        }
    });
}

/* COLLISION */
function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

/* GAME LOOP */
function gamePlay() {
    if (!player.start) return;

    let carLeft = car.offsetLeft;

    if (keys["ArrowLeft"] && carLeft > 0) {
        car.style.left = (carLeft - player.speed) + "px";
    }

    if (keys["ArrowRight"] && carLeft < 400) {
        car.style.left = (carLeft + player.speed) + "px";
    }

    moveLines();
    moveEnemies();

    scoreDisplay.innerText = player.score;

    window.requestAnimationFrame(gamePlay);
}

/* END GAME */
function endGame() {
    player.start = false;

    alert("💥 Game Over! Score: " + player.score);

    startBtn.innerText = "Restart Game";
    startBtn.style.display = "inline-block";
}
