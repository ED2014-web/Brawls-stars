const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class Entity {
  constructor(x, y, color, size=30) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speed = 3;
    this.hp = 3;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

class Bullet {
  constructor(x, y, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = 6;
    this.color = color;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// Joueur
const player = new Entity(400, 300, "cyan");
let lives = 3;
let score = 0;

const bullets = [];
const enemies = [];

// Générer des ennemis
function spawnEnemy() {
  enemies.push(new Entity(Math.random()*750, Math.random()*550, "red"));
}
for (let i = 0; i < 5; i++) spawnEnemy();

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    bullets.push(new Bullet(player.x+player.size/2, player.y+player.size/2, 0, -6, "yellow"));
  }
});

function update() {
  // Déplacement du joueur
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  // Déplacement des balles
  bullets.forEach((b, i) => {
    b.update();
    if (b.y < 0) bullets.splice(i, 1);
  });

  // Déplacement des ennemis
  enemies.forEach(enemy => {
    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > 0) {
      enemy.x += (dx / dist) * 1.5;
      enemy.y += (dy / dist) * 1.5;
    }

    // Collision avec joueur
    if (enemy.x < player.x + player.size &&
        enemy.x + enemy.size > player.x &&
        enemy.y < player.y + player.size &&
        enemy.y + enemy.size > player.y) {
      lives--;
      enemies.splice(enemies.indexOf(enemy), 1);
      spawnEnemy();
    }
  });

  // Collision balles/ennemis
  bullets.forEach((b, bi) => {
    enemies.forEach((enemy, ei) => {
      if (b.x < enemy.x + enemy.size &&
          b.x + b.size > enemy.x &&
          b.y < enemy.y + enemy.size &&
          b.y + b.size > enemy.y) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score += 10;
        spawnEnemy();
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  bullets.forEach(b => b.draw());
  enemies.forEach(e => e.draw());

  // HUD
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Vies: " + lives, 10, 45);

  if (lives <= 0) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width/2 - 100, canvas.height/2);
    return;
  }
}

function loop() {
  if (lives > 0) {
    update();
    draw();
    requestAnimationFrame(loop);
  } else {
    draw();
  }
}
loop();