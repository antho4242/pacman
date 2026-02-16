const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Score
let score = 0;

// Pac-Man
let pacman = {
    x: 200,
    y: 200,
    size: 15,
    speed: 3,
    dx: 0,
    dy: 0,
    mouthOpen: 0
};

// Pastilles (pellets)
let pellets = [];
const pelletSize = 5;
const pelletSpacing = 40;

// Créer les pastilles
function createPellets() {
    pellets = [];
    for (let x = 30; x < canvas.width - 30; x += pelletSpacing) {
        for (let y = 30; y < canvas.height - 30; y += pelletSpacing) {
            pellets.push({
                x: x,
                y: y,
                eaten: false
            });
        }
    }
}

// Dessiner les pastilles
function drawPellets() {
    ctx.fillStyle = '#fff';
    pellets.forEach(pellet => {
        if (!pellet.eaten) {
            ctx.beginPath();
            ctx.arc(pellet.x, pellet.y, pelletSize, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}

// Vérifier si Pac-Man mange une pastille
function checkPelletCollision() {
    pellets.forEach(pellet => {
        if (!pellet.eaten) {
            const dx = pacman.x - pellet.x;
            const dy = pacman.y - pellet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < pacman.size + pelletSize) {
                pellet.eaten = true;
                score += 10;
                updateScore();
            }
        }
    });
}

// Mettre à jour le score
function updateScore() {
    const scoreElement = document.getElementById('scoreValue');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

// Dessiner Pac-Man
function drawPacman() {
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    
    // Animation bouche
    const mouthAngle = 0.2 * Math.sin(pacman.mouthOpen);
    
    // Direction de la bouche selon le mouvement
    let rotation = 0;
    if (pacman.dx > 0) rotation = 0;
    else if (pacman.dx < 0) rotation = Math.PI;
    else if (pacman.dy > 0) rotation = Math.PI / 2;
    else if (pacman.dy < 0) rotation = -Math.PI / 2;
    
    ctx.save();
    ctx.translate(pacman.x, pacman.y);
    ctx.rotate(rotation);
    ctx.arc(0, 0, pacman.size, mouthAngle, 2 * Math.PI - mouthAngle);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.restore();
    
    // Oeil
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pacman.x + 5, pacman.y - 8, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    pacman.mouthOpen += 0.2;
}

// Mettre à jour la position
function update() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;
    
    // Limites du canvas
    if (pacman.x < pacman.size) pacman.x = pacman.size;
    if (pacman.x > canvas.width - pacman.size) 
        pacman.x = canvas.width - pacman.size;
    if (pacman.y < pacman.size) pacman.y = pacman.size;
    if (pacman.y > canvas.height - pacman.size) 
        pacman.y = canvas.height - pacman.size;
    
    // Vérifier collision avec pastilles
    checkPelletCollision();
}

// Boucle de jeu
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPellets();
    update();
    drawPacman();
    requestAnimationFrame(gameLoop);
}

// Contrôles clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        pacman.dx = 0;
        pacman.dy = -pacman.speed;
    } else if (e.key === 'ArrowDown') {
        pacman.dx = 0;
        pacman.dy = pacman.speed;
    } else if (e.key === 'ArrowLeft') {
        pacman.dx = -pacman.speed;
        pacman.dy = 0;
    } else if (e.key === 'ArrowRight') {
        pacman.dx = pacman.speed;
        pacman.dy = 0;
    } else if (e.key === ' ') {
        pacman.dx = 0;
        pacman.dy = 0;
    }
});

// Initialiser et démarrer le jeu
createPellets();
gameLoop();