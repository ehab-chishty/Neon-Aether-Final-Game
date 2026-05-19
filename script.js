window.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const enemy = document.getElementById('enemy');
    const arena = document.getElementById('game-arena');
    const scoreBoard = document.getElementById('score-board');
    const timerDisplay = document.getElementById('timer');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    let score = 0;
    let timeLeft = 30;
    let gameActive = false;
    let timerStarted = false;
    let currentLevel = 1;
    let enemySpeed = 1; // Level 1 speed

    arena.addEventListener('click', () => {
        if (!timerStarted) {
            timerStarted = true;
            gameActive = true;
            startClock();
        }
    });

    fullscreenBtn.addEventListener('click', () => {
        const gameSection = arena.parentElement;
        if (!document.fullscreenElement) {
            gameSection.requestFullscreen().catch(err => {
                alert(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    function startClock() {
        const gameClock = setInterval(() => {
            timeLeft--;
            if(timerDisplay) timerDisplay.innerText = timeLeft;

            // === START OF ENEMY MOVEMENT LOGIC ===
            // This runs every second. If the player is on Level 2 or higher,
            // the enemy will automatically shift up or down by 15 pixels!
            if (currentLevel >= 2) {
                let enemyTop = parseInt(window.getComputedStyle(enemy).top) || 185;
                // Move up or down randomly
                let movement = Math.random() > 0.5 ? 15 : -15; 
                
                // Keep the enemy inside the 400px tall arena boundaries
                let newTop = enemyTop + movement;
                if (newTop > 0 && newTop < 360) {
                    enemy.style.top = newTop + "px";
                }
            }
            // === END OF ENEMY MOVEMENT LOGIC ===

            if (timeLeft <= 0) {
                clearInterval(gameClock);
                gameActive = false;
                scoreBoard.innerHTML = `GAME OVER | LEVEL: ${currentLevel} | SCORE: ${score}`;
            }
        }, 1000); // 1000ms = 1 second
    }

    window.addEventListener('keydown', (e) => {
        if (!gameActive) return;
        
        let pTop = parseInt(window.getComputedStyle(player).top);
        let pLeft = parseInt(window.getComputedStyle(player).left);

        if (e.key === 'ArrowUp') player.style.top = (pTop - 20) + 'px';
        if (e.key === 'ArrowDown') player.style.top = (pTop + 20) + 'px';
        if (e.key === 'ArrowLeft') player.style.left = (pLeft - 20) + 'px';
        if (e.key === 'ArrowRight') player.style.left = (pLeft + 20) + 'px';

        if (e.key === ' ') {
            const pRect = player.getBoundingClientRect();
            const eRect = enemy.getBoundingClientRect();
            const dist = Math.hypot(pRect.x - eRect.x, pRect.y - eRect.y);

            if (dist < 70) {
                score++;
                checkLevelUp(); // Check if we should level up
                updateDisplay();
                spawnEnemy();
            }
        }
    });

    function checkLevelUp() {
        // Level up every 10 points
        if (score % 10 === 0) {
            currentLevel++;
            timeLeft += 5; // Reward player with 5 extra seconds!
            enemySpeed += 0.5; // Make something harder (logic for this below)
            arena.style.borderColor = currentLevel % 2 === 0 ? "gold" : "#00f2ff";
        }
    }

    function updateDisplay() {
        scoreBoard.innerHTML = `Lvl: ${currentLevel} | Glitches: ${score} | Time: <span id="timer">${timeLeft}</span>s`;
    }

    function spawnEnemy() {
        enemy.style.top = Math.random() * 300 + "px";
        enemy.style.left = (Math.random() * 70 + 10) + "%";
    }
});