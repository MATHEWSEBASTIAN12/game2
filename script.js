const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

let player = { speed: 4, score: 0, start: false };
let keys = { ArrowLeft: false, ArrowRight: false };

let car;

/* ALERT BEFORE START */
alert("Better to play in laptops for best experience!");

startBtn.addEventListener("click", startGame);

/* START GAME */
function startGame() {
    gameArea.innerHTML = "";
    player.start = true;
    player.score = 0;
    player.speed = 4;

    startBtn.style.display = "none";

    /* create player car */
    car = document.createElement("div");
    car.classList.add("car");
    gameArea.appendChild(car);

    /* road lines */
    for (let i = 0; i < 6; i++) {
        let line = document.createElement("div");
        line.classList.add("line");
        line.style.top = (i * 120) + "px";
        gameArea.appendChild(line);
    }

    /* enemy cars */
    for (let i = 0; i < 3; i++) {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.style.left = Math.floor(Math.random() * 340) + "px";
        enemy.style.top = (i * -250) + "px";
        gameArea.appendChild(enemy);
    }

    window.requestAnimationFrame(gamePlay);
}

/* KEY CONTROL */
document.addEventListener("keydown", e => {
    keys[e.key] = true;
});
document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

/* MOVE ROAD */
function moveLines() {
    document.querySelectorAll(".line").forEach(line => {
        let top = parseInt(line.style.top);
        top += player.speed;

        if (top > 650) top = -120;
        line.style.top = top + "px";
    });
}

/* MOVE ENEMY */
function moveEnemies() {
    document.querySelectorAll(".enemy").forEach(enemy => {
        let top = parseInt(enemy.style.top);
        top += player.speed;

        if (top > 650) {
            top = -250;
            enemy.style.left = Math.floor(Math.random() * 340) + "px";
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

    let carRect = car.getBoundingClientRect();
    let areaRect = gameArea.getBoundingClientRect();

    if (keys.ArrowLeft && carRect.left > areaRect.left) {
        car.style.left = car.offsetLeft - player.speed + "px";
    }
    if (keys.ArrowRight && carRect.right < areaRect.right) {
        car.style.left = car.offsetLeft + player.speed + "px";
    }

    moveLines();
    moveEnemies();

    /* gradual speed increase */
    if (player.score % 5 === 0) {
        player.speed += 0.005;
    }

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
