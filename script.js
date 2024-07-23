const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size
canvas.width = 800; // Set your desired width
canvas.height = 600; // Set your desired height

const playerImage = new Image();
playerImage.src = 'player.png'; // Path to your player image

const enemyImage = new Image();
enemyImage.src = 'enemy.png'; // Path to your enemy image

const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0
};

const bullets = [];
const enemies = [];
const stars = [];
let score = 0;
let lives = 3;
let gameOver = false;

// Create stars for the background
function createStar() {
  const star = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.2
  };
  stars.push(star);
}

function drawStars() {
  stars.forEach((star, index) => {
    star.y += star.speed;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    // Recycle stars that go off screen
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
}

// Create initial stars
for (let i = 0; i < 200; i++) { // Increased the number of stars for better coverage
  createStar();
}

function drawPlayer() {
  ctx.drawImage(playerImage, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

function movePlayer() {
  player.x += player.dx;
  if (player.x < player.width / 2) {
    player.x = player.width / 2;
  }
  if (player.x + player.width / 2 > canvas.width) {
    player.x = canvas.width - player.width / 2;
  }
}

function handleKeyDown(e) {
  if (e.key === 'ArrowRight' || e.key === 'd') {
    player.dx = player.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'a') {
    player.dx = -player.speed;
  } else if (e.key === ' ') {
    shoot();
  }
}

function handleKeyUp(e) {
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'ArrowLeft' || e.key === 'a') {
    player.dx = 0;
  }
}

function shoot() {
  const bullet = {
    x: player.x,
    y: player.y - player.height / 2,
    radius: 5,
    color: 'red',
    speed: 7
  };
  bullets.push(bullet);
}

function drawBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fillStyle = bullet.color;
    ctx.fill();
    ctx.closePath();

    // Remove bullets that go off screen
    if (bullet.y + bullet.radius < 0) {
      bullets.splice(index, 1);
    }
  });
}

function createEnemy() {
  const enemy = {
    x: Math.random() * (canvas.width - 30) + 15,
    y: -30,
    width: 40,
    height: 25,
    speed: 2 + Math.random() * 2 // Random speed between 2 and 5
  };
  enemies.push(enemy);
}

function drawEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    ctx.drawImage(enemyImage, enemy.x - enemy.width / 2, enemy.y - enemy.height / 2, enemy.width, enemy.height);

    // Remove enemies that go off screen and reduce lives
    if (enemy.y - enemy.height / 2 > canvas.height) {
      enemies.splice(index, 1);
      lives -= 1;
      if (lives <= 0) {
        gameOver = true;
      }
    }

    // Check for collision with player
    if (checkCollision(player, enemy)) {
      enemies.splice(index, 1);
      lives -= 1;
      if (lives <= 0) {
        gameOver = true;
      }
    }

    // Check for collision with bullets
    bullets.forEach((bullet, bulletIndex) => {
      if (checkCollision(bullet, enemy)) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(index, 1);
        score += 10;
      }
    });
  });
}

function checkCollision(obj1, obj2) {
  const dist = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
  return dist < (obj1.width || obj1.radius) / 2 + (obj2.width || obj2.radius) / 2;
}

function drawUI() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 30);
}

function update() {
  if (gameOver) {
    document.getElementById('game-over').style.display = 'block';
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();
  drawPlayer();
  movePlayer();
  drawBullets();
  drawEnemies();
  drawUI();

  requestAnimationFrame(update);
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Create enemies at intervals
setInterval(createEnemy, 1000);

update();
