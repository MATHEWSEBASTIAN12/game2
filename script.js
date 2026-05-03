const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

let player = { speed: 5, score: 0, start: false };
let keys = {};
let car;

/* NITRO */
let nitro = { active: false, value: 100, max: 100 };

/* POLICE */
let police = { active: false, car: null, timer: 0 };

alert("Better to play in laptops\nSHIFT = Nitro 🚀");

/* START */
startBtn.addEventListener("click", startGame);

function startGame() {
    gameArea.innerHTML = "";
    keys = {};

    player.start = true;
    player.score = 0;
    player.speed = 5;

    nitro.value = 100;
    police.active = false;

    startBtn.style.display = "none";

    /* PLAYER */
    car = document.createElement("div");
    car.classList.add("car");
    car.style.left = "200px";
    gameArea.appendChild(car);

    /* NITRO BAR */
    let nitroBar = document.createElement("div");
    nitroBar.id = "nitroBar";
    nitroBar.style.position = "absolute";
    nitroBar.style.bottom = "0";
    nitroBar.style.left = "0";
    nitroBar.style.height = "10px";
    nitroBar.style.background = "cyan";
    gameArea.appendChild(nitroBar);

    /* ROAD */
    for (let i = 0; i < 6; i++) {
        let line = document.createElement("div");
        line.classList.add("line");
        line.style.top = (i * 150) + "px";
        gameArea.appendChild(line);
    }

    /* ENEMIES */
    for (let i = 0; i < 3; i++) {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.style.left = Math.floor(Math.random() * 400) + "px";
        enemy.style.top = (i * -250) + "px";
        gameArea.appendChild(enemy);
    }

    requestAnimationFrame(gamePlay);
}

/* KEYS */
document.addEventListener("keydown", e => {
    if (e.repeat) return;
    keys[e.key] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

/* POLICE SPAWN (BEHIND) */
function spawnPolice() {
    police.active = true;

    police.car = document.createElement("div");
    police.car.classList.add("police");

    police.car.style.top = "700px";
    police.car.style.left = (car.offsetLeft + (Math.random() * 60 - 30)) + "px";

    police.timer = 0;

    gameArea.appendChild(police.car);
}

/* POLICE MOVE (ESCAPABLE) */
function movePolice(speed) {
    if (!police.active) return;

    let p = police.car;

    let top = parseInt(p.style.top);
    top -= (speed + 1);
    p.style.top = top + "px";

    let playerX = car.offsetLeft;
    let policeX = p.offsetLeft;

    let followSpeed = 1.5;

    if (Math.random() > 0.3) {
        if (policeX < playerX) p.style.left = (policeX + followSpeed) + "px";
        if (policeX > playerX) p.style.left = (policeX - followSpeed) + "px";
    }

    if (isCollide(car, p)) {
        endGame("🚓 Caught by Police!");
    }

    if (top < -120 || police.timer > 600) {
        police.active = false;
        p.remove();
    }

    police.timer++;
}

/* LINES */
function moveLines(speed) {
    document.querySelectorAll(".line").forEach(line => {
        let top = parseInt(line.style.top);
        top += speed;
        if (top > 700) top = -150;
        line.style.top = top + "px";
    });
}

/* ENEMIES */
function moveEnemies(speed) {
    document.querySelectorAll(".enemy").forEach(enemy => {
        let top = parseInt(enemy.style.top);
        top += speed;

        if (top > 700) {
            top = -250;
            enemy.style.left = Math.floor(Math.random() * 400) + "px";
            player.score++;
        }

        enemy.style.top = top + "px";

        if (isCollide(car, enemy)) {
            endGame("💥 Crashed!");
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

    let baseSpeed = player.speed;

    /* NITRO */
    if (keys["Shift"] && nitro.value > 0) {
        nitro.active = true;
        nitro.value -= 1;
    } else {
        nitro.active = false;
        if (nitro.value < nitro.max) nitro.value += 0.5;
    }

    let speed = nitro.active ? baseSpeed * 2 : baseSpeed;

    /* PLAYER MOVE */
    let carLeft = car.offsetLeft;

    if (keys["ArrowLeft"]) carLeft -= speed;
    if (keys["ArrowRight"]) carLeft += speed;

    if (carLeft < 0) carLeft = 0;
    if (carLeft > 400) carLeft = 400;

    car.style.left = carLeft + "px";

    /* RANDOM POLICE SPAWN */
    if (player.score > 5 && !police.active && Math.random() < 0.01) {
        spawnPolice();
    }

    moveLines(speed);
    moveEnemies(speed);
    movePolice(speed);

    document.getElementById("nitroBar").style.width = nitro.value + "%";

    scoreDisplay.innerText = player.score;

    requestAnimationFrame(gamePlay);
}

/* END */
function endGame(msg) {
    player.start = false;

    alert(msg + " | Score: " + player.score);

    startBtn.innerText = "Restart Game";
    startBtn.style.display = "inline-block";
}
