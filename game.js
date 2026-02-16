const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Score et état du jeu
let score = 0;
let gameOver = false;

// Pac-Man
let pacman = {
    x: 50,
    y: 50,
    size: 15,
    speed: 3,
    dx: 0,
    dy: 0,
    mouthOpen: 0
};

// Fantôme
let ghost = {
    x: 350,
    y: 350,
    size: 15,
    speed: 2,
    color: '#ff0000'
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

// Dessiner le fantôme
function drawGhost() {
    // Corps du fantôme
    ctx.fillStyle = ghost.color;
    ctx.beginPath();
    ctx.arc(ghost.x, ghost.y - 5, ghost.size, Math.PI, 0);
    ctx.lineTo(ghost.x + ghost.size, ghost.y + ghost.size);
    ctx.lineTo(ghost.x + ghost.size * 0.75, ghost.y + ghost.size - 5);
    ctx.lineTo(ghost.x + ghost.size * 0.5, ghost.y + ghost.size);
    ctx.lineTo(ghost.x + ghost.size * 0.25, ghost.y + ghost.size - 5);
    ctx.lineTo(ghost.x, ghost.y + ghost.size);
    ctx.lineTo(ghost.x - ghost.size, ghost.y + ghost.size);
    ctx.lineTo(ghost.x - ghost.size * 0.75, ghost.y + ghost.size - 5);
    ctx.lineTo(ghost.x - ghost.size * 0.5, ghost.y + ghost.size);
    ctx.lineTo(ghost.x - ghost.size * 0.25, ghost.y + ghost.size - 5);
    ctx.lineTo(ghost.x - ghost.size, ghost.y + ghost.size);
    ctx.closePath();
    ctx.fill();
    
    // Yeux blancs
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ghost.x - 5, ghost.y - 3, 4, 0, 2 * Math.PI);
    ctx.arc(ghost.x + 5, ghost.y - 3, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pupilles
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(ghost.x - 5, ghost.y - 3, 2, 0, 2 * Math.PI);
    ctx.arc(ghost.x + 5, ghost.y - 3, 2, 0, 2 * Math.PI);
    ctx.fill();
}

// Déplacer le fantôme vers Pac-Man (IA simple)
function updateGhost() {
    if (gameOver) return;
    
    const dx = pacman.x - ghost.x;
    const dy = pacman.y - ghost.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
        ghost.x += (dx / distance) * ghost.speed;
        ghost.y += (dy / distance) * ghost.speed;
    }
    
    // Vérifier collision avec Pac-Man
    checkGhostCollision();
}

// Vérifier collision avec le fantôme
function checkGhostCollision() {
    const dx = pacman.x - ghost.x;
    const dy = pacman.y - ghost.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < pacman.size + ghost.size) {
        gameOver = true;
        showGameOver();
    }
}

// Afficher Game Over
function showGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Score final: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    
    ctx.font = '16px Arial';
    ctx.fillText('Appuyez sur R pour recommencer', canvas.width / 2, canvas.height / 2 + 60);
}

// Redémarrer le jeu
function restartGame() {
    gameOver = false;
    score = 0;
    updateScore();
    
    pacman.x = 50;
    pacman.y = 50;
    pacman.dx = 0;
    pacman.dy = 0;
    
    ghost.x = 350;
    ghost.y = 350;
    
    createPellets();
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
                
                // Vérifier si toutes les pastilles sont mangées
                const allEaten = pellets.every(p => p.eaten);
                if (allEaten) {
                    gameOver = true;
                    showVictory();
                }
            }
        }
    });
}

// Afficher la victoire
function showVictory() {
    ctx.fillStyle = 'rgba(0, 100, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('VICTOIRE !', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    
    ctx.font = '16px Arial';
    ctx.fillText('Appuyez sur R pour recommencer', canvas.width / 2, canvas.height / 2 + 60);
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
    if (gameOver) return;
    
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
    
    // Mettre à jour le fantôme
    updateGhost();
}

// Boucle de jeu
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPellets();
    drawGhost();
    drawPacman();
    
    if (!gameOver) {
        update();
    }
    
    requestAnimationFrame(gameLoop);
}

// Contrôles clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        if (gameOver) {
            restartGame();
        }
        return;
    }
    
    if (gameOver) return;
    
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