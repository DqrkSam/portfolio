import sprites from './sprites.js';

class DinoGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        // Game state
        this.isPlaying = false;
        this.gameSpeed = 6;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('dinoHighScore')) || 0;
        this.frameCount = 0;
        
        // Load sprites
        this.sprites = {};
        this.loadSprites();
        
        // Dino properties
        this.dino = {
            x: 50,
            y: this.canvas.height - 60,
            width: 44,
            height: 47,
            jumping: false,
            ducking: false,
            velocity: 0,
            gravity: 0.6,
            jumpForce: -15,
            frame: 0,
            animationSpeed: 6
        };
        
        // Obstacles array
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.minObstacleInterval = 60;
        this.obstacleInterval = 120;
        
        // Clouds array
        this.clouds = [];
        this.cloudTimer = 0;
        
        // Ground
        this.ground = {
            y: this.canvas.height - 20,
            width: this.canvas.width,
            height: 20,
            segments: []
        };
        this.initGround();

        // Settings
        this.isDarkMode = true;
        this.isSoundOn = true;
        
        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleTouch = this.handleTouch.bind(this);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Show start screen
        this.showStartScreen();

        // Add touch control handling
        const jumpBtn = document.getElementById('jumpBtn');
        const duckBtn = document.getElementById('duckBtn');

        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isPlaying) {
                this.jump();
            }
        });

        duckBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isPlaying) {
                this.dino.ducking = true;
            }
        });

        duckBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.isPlaying) {
                this.dino.ducking = false;
            }
        });

        // Add touch event listeners for the game container
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.isPlaying) {
                this.startGame();
            } else if (this.isPlaying) {
                this.gameOver();
            }
        });

        // Update theme toggle and sound toggle IDs
        const themeToggle = document.getElementById('themeToggle');
        const soundToggle = document.getElementById('soundToggle');
    }
    
    loadSprites() {
        // Load all sprites
        Object.entries(sprites).forEach(([key, value]) => {
            if (typeof value === 'object') {
                this.sprites[key] = {};
                Object.entries(value).forEach(([subKey, subValue]) => {
                    const img = new Image();
                    img.src = subValue;
                    this.sprites[key][subKey] = img;
                });
            } else {
                const img = new Image();
                img.src = value;
                this.sprites[key] = img;
            }
        });
    }
    
    setupCanvas() {
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 300;
        
        // Setup high DPI canvas
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        this.ctx.scale(dpr, dpr);
    }
    
    initGround() {
        const segmentWidth = 20;
        const numSegments = Math.ceil(this.canvas.width / segmentWidth) + 1;
        
        for (let i = 0; i < numSegments; i++) {
            this.ground.segments.push({
                x: i * segmentWidth,
                width: segmentWidth
            });
        }
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', this.handleInput);
        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowDown') this.dino.ducking = false;
        });
        
        this.canvas.addEventListener('touchstart', this.handleTouch);
        this.canvas.addEventListener('touchend', () => this.dino.ducking = false);
        
        // Theme toggle
        document.querySelector('.theme-toggle').addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            document.body.classList.toggle('light-theme');
            document.querySelector('.theme-toggle i').className = 
                this.isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
        });
        
        // Sound toggle
        document.querySelector('.sound-toggle').addEventListener('click', () => {
            this.isSoundOn = !this.isSoundOn;
            document.querySelector('.sound-toggle i').className = 
                this.isSoundOn ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        });
    }
    
    handleInput(e) {
        if ((e.code === 'Space' || e.code === 'ArrowUp') && !this.dino.jumping) {
            this.jump();
        } else if (e.code === 'ArrowDown') {
            this.dino.ducking = true;
            if (this.dino.jumping) {
                this.dino.velocity += 5;
            }
        }
        
        if (!this.isPlaying && (e.code === 'Space' || e.code === 'ArrowUp')) {
            this.startGame();
        }
    }
    
    handleTouch(e) {
        e.preventDefault();
        if (!this.isPlaying) {
            this.startGame();
            return;
        }
        
        const touch = e.touches[0];
        const touchY = touch.clientY - this.canvas.getBoundingClientRect().top;
        
        if (touchY > this.canvas.height / 2) {
            this.dino.ducking = true;
        } else if (!this.dino.jumping) {
            this.jump();
        }
    }
    
    jump() {
        this.dino.jumping = true;
        this.dino.velocity = this.dino.jumpForce;
        if (this.isSoundOn) {
            const jumpSound = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==');
            jumpSound.play().catch(() => {});
        }
    }
    
    updateDino() {
        // Apply gravity
        this.dino.velocity += this.dino.gravity;
        this.dino.y += this.dino.velocity;
        
        // Ground collision
        if (this.dino.y > this.canvas.height - this.dino.height - this.ground.height) {
            this.dino.y = this.canvas.height - this.dino.height - this.ground.height;
            this.dino.jumping = false;
            this.dino.velocity = 0;
        }
        
        // Update animation frame
        if (!this.dino.jumping) {
            if (this.frameCount % this.dino.animationSpeed === 0) {
                this.dino.frame = (this.dino.frame + 1) % 2;
            }
        }
        
        // Update height when ducking
        this.dino.height = this.dino.ducking ? 25 : 47;
        this.dino.y = Math.min(this.dino.y, this.canvas.height - this.dino.height - this.ground.height);
    }
    
    createObstacle() {
        const types = ['cactusSmall', 'cactusLarge', 'bird'];
        const type = types[Math.floor(Math.random() * types.length)];
        const height = type === 'bird' ? 30 : (type === 'cactusSmall' ? 40 : 50);
        const y = type === 'bird' 
            ? this.canvas.height - height - this.ground.height - Math.random() * 50
            : this.canvas.height - height - this.ground.height;
        
        this.obstacles.push({
            x: this.canvas.width,
            y,
            width: 20,
            height,
            type
        });
    }
    
    createCloud() {
        this.clouds.push({
            x: this.canvas.width,
            y: Math.random() * (this.canvas.height / 2),
            speed: this.gameSpeed * 0.5
        });
    }
    
    updateObstacles() {
        // Create new obstacles
        this.obstacleTimer++;
        if (this.obstacleTimer > this.obstacleInterval) {
            this.createObstacle();
            this.obstacleTimer = 0;
            this.obstacleInterval = this.minObstacleInterval + Math.random() * 60;
        }
        
        // Update and remove obstacles
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.x -= this.gameSpeed;
            return obstacle.x > -obstacle.width;
        });
    }
    
    updateClouds() {
        // Create new clouds
        this.cloudTimer++;
        if (this.cloudTimer > 200) {
            this.createCloud();
            this.cloudTimer = 0;
        }
        
        // Update and remove clouds
        this.clouds = this.clouds.filter(cloud => {
            cloud.x -= cloud.speed;
            return cloud.x > -50;
        });
    }
    
    updateGround() {
        this.ground.segments.forEach(segment => {
            segment.x -= this.gameSpeed;
            if (segment.x + segment.width < 0) {
                segment.x = Math.max(...this.ground.segments.map(s => s.x)) + segment.width;
            }
        });
    }
    
    checkCollision(obstacle) {
        const dinoHitbox = {
            x: this.dino.x + 5,
            y: this.dino.y + 5,
            width: this.dino.width - 10,
            height: this.dino.height - 10
        };
        
        return !(
            dinoHitbox.x + dinoHitbox.width < obstacle.x ||
            dinoHitbox.x > obstacle.x + obstacle.width ||
            dinoHitbox.y + dinoHitbox.height < obstacle.y ||
            dinoHitbox.y > obstacle.y + obstacle.height
        );
    }
    
    drawDino() {
        let sprite;
        if (this.dino.ducking) {
            sprite = this.sprites.dino.ducking;
        } else if (this.dino.jumping) {
            sprite = this.sprites.dino.standing;
        } else {
            sprite = this.dino.frame === 0 ? this.sprites.dino.running1 : this.sprites.dino.running2;
        }
        
        this.ctx.drawImage(sprite, this.dino.x, this.dino.y, this.dino.width, this.dino.height);
    }
    
    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            const sprite = this.sprites.obstacles[obstacle.type];
            this.ctx.drawImage(sprite, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }
    
    drawClouds() {
        this.clouds.forEach(cloud => {
            this.ctx.drawImage(this.sprites.cloud, cloud.x, cloud.y, 50, 20);
        });
    }
    
    drawGround() {
        this.ctx.fillStyle = this.isDarkMode ? '#fff' : '#535353';
        this.ground.segments.forEach(segment => {
            this.ctx.fillRect(segment.x, this.ground.y, segment.width, this.ground.height);
        });
    }
    
    updateScore() {
        this.score++;
        const currentScore = document.querySelector('.current-score');
        currentScore.textContent = String(Math.floor(this.score / 10)).padStart(5, '0');
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('dinoHighScore', this.highScore);
            document.querySelector('.high-score span').textContent = 
                String(Math.floor(this.highScore / 10)).padStart(5, '0');
        }
    }
    
    showStartScreen() {
        document.querySelector('.start-screen').classList.remove('hidden');
        document.querySelector('.game-over').classList.add('hidden');
    }
    
    showGameOverScreen() {
        document.querySelector('.game-over').classList.remove('hidden');
        document.querySelector('.start-screen').classList.add('hidden');
    }
    
    startGame() {
        this.isPlaying = true;
        this.score = 0;
        this.gameSpeed = 6;
        this.obstacles = [];
        this.clouds = [];
        this.dino.y = this.canvas.height - this.dino.height - this.ground.height;
        this.dino.jumping = false;
        this.dino.ducking = false;
        document.querySelector('.start-screen').classList.add('hidden');
        document.querySelector('.game-over').classList.add('hidden');
        requestAnimationFrame(this.animate);
    }
    
    gameOver() {
        this.isPlaying = false;
        if (this.isSoundOn) {
            const hitSound = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==');
            hitSound.play().catch(() => {});
        }
        this.showGameOverScreen();
    }
    
    animate() {
        if (!this.isPlaying) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update game objects
        this.updateDino();
        this.updateObstacles();
        this.updateClouds();
        this.updateGround();
        this.updateScore();
        
        // Draw game objects
        this.drawClouds();
        this.drawGround();
        this.drawDino();
        this.drawObstacles();
        
        // Check collisions
        if (this.obstacles.some(obstacle => this.checkCollision(obstacle))) {
            this.gameOver();
            return;
        }
        
        // Increase game speed
        if (this.score % 100 === 0) {
            this.gameSpeed += 0.1;
        }
        
        this.frameCount++;
        requestAnimationFrame(this.animate);
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    new DinoGame();
}); 