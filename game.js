const canvas = document.getElementById('gameCanvas');

   const ctx = canvas.getContext('2d');
 
   // Pac-Man

   let pacman = {

       x: 200,

       y: 200,

       size: 20,

       speed: 3,

       dx: 0,

       dy: 0,

       mouthOpen: 0

   };
 
   // Dessiner Pac-Man

   function drawPacman() {

       ctx.fillStyle = '#ffff00';

       ctx.beginPath();

       // Animation bouche

       const mouthAngle = 0.2 * Math.sin(pacman.mouthOpen);

       ctx.arc(pacman.x, pacman.y, pacman.size, 

               mouthAngle, 2 * Math.PI - mouthAngle);

       ctx.lineTo(pacman.x, pacman.y);

       ctx.fill();

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

   }
 
   // Boucle de jeu

   function gameLoop() {

       ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        // Barre d'espace pour arrêter
        pacman.dx = 0;
        pacman.dy = 0;
    }
});


 
   // Démarrer le jeu

   gameLoop();
 