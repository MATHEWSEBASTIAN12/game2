const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");

let player = { speed: 5, score: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

// Create player car
let car = document.createElement("div");
car.classList.add("car");
gameArea.appendChild(car);

// Controls
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// Create road lines
for (let i = 0; i < 5; i++) {
    let line = document.createElement("div");
    line.classList.add("line");
    line.style.top = (i * 100) + "px";
    gameArea.appendChild(line);
}

// Create enemies
for (let i = 0; i < 3; i++) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.left = Math.floor(Math.random() * 250) + "px";
    enemy.style.top = (i * -200) + "px";
    gameArea.appendChild(enemy);
}

function moveLines() {
    let lines = document.querySelectorAll(".line");
    lines.forEach(line => {
        let top = parseInt(line.style.top);
        top += player.speed;
        if (top > 500) top = -100;
        line.style.top = top + "px";
    });
}

function moveEnemies() {
    let enemies = document.querySelectorAll(".enemy");
    enemies.forEach(enemy => {
        let top = parseInt(enemy.style.top);
        top += player.speed;

        if (top > 500) {
            top = -200;
            enemy.style.left = Math.floor(Math.random() * 250) + "px";
            player.score++;
        }

        enemy.style.top = top + "px";

        // Collision detection
        if (isCollide(car, enemy)) {
            alert("Game Over! Score: " + player.score);
            location.reload();
        }
    });
}

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

function gamePlay() {
    let carRect = car.getBoundingClientRect();
    let areaRect = gameArea.getBoundingClientRect();

    if (keys.ArrowLeft && carRect.left > areaRect.left) {
        car.style.left = car.offsetLeft - player.speed + "px";
    }
    if (keys.ArrowRight && carRect.right < areaRect.right) {
        car.style.left = car.offsetLeft + player.speed + "px";
    }
    if (keys.ArrowUp && carRect.top > areaRect.top) {
        car.style.top = car.offsetTop - player.speed + "px";
    }
    if (keys.ArrowDown && carRect.bottom < areaRect.bottom) {
        car.style.top = car.offsetTop + player.speed + "px";
    }

    moveLines();
    moveEnemies();

    scoreDisplay.innerText = player.score;

    window.requestAnimationFrame(gamePlay);
}

gamePlay();
