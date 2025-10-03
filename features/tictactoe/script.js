class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'x';
        this.gameActive = true;
        this.vsAI = true;
        this.difficulty = 'easy';
        this.scores = { x: 0, o: 0, ties: 0 };
        this.isDarkMode = true;
        this.isSoundOn = true;
        
        // Cache DOM elements
        this.cells = document.querySelectorAll('[data-cell]');
        this.statusElement = document.querySelector('.status');
        this.restartButton = document.querySelector('.restart-btn');
        this.winMessage = document.querySelector('.win-message');
        this.winText = document.querySelector('.win-text');
        this.playAgainButton = document.querySelector('.play-again-btn');
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.diffButtons = document.querySelectorAll('.diff-btn');
        this.difficultyContainer = document.querySelector('.difficulty');
        
        this.setupEventListeners();
        this.updateScoreBoard();
    }
    
    setupEventListeners() {
        // Cell clicks
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        
        // Restart and play again buttons
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.playAgainButton.addEventListener('click', () => {
            this.winMessage.classList.add('hidden');
            this.restartGame();
        });
        
        // Game mode buttons
        this.modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.modeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.vsAI = button.dataset.mode === 'ai';
                this.difficultyContainer.classList.toggle('hidden', !this.vsAI);
                this.restartGame();
            });
        });
        
        // Difficulty buttons
        this.diffButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.diffButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.difficulty = button.dataset.diff;
                this.restartGame();
            });
        });
        
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
    
    handleCellClick(cell) {
        const index = Array.from(this.cells).indexOf(cell);
        
        if (this.board[index] || !this.gameActive) return;
        
        this.makeMove(index);
        
        if (this.vsAI && this.gameActive) {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }
    
    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer);
        this.cells[index].innerHTML = `<i class="fas fa-${this.currentPlayer === 'x' ? 'times' : 'circle'}"></i>`;
        
        if (this.checkWin()) {
            this.endGame(false);
        } else if (this.checkDraw()) {
            this.endGame(true);
        } else {
            this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
            this.updateStatus();
        }
    }
    
    makeAIMove() {
        let index;
        
        switch (this.difficulty) {
            case 'easy':
                index = this.getRandomMove();
                break;
            case 'medium':
                index = Math.random() < 0.5 ? this.getBestMove() : this.getRandomMove();
                break;
            case 'hard':
                index = this.getBestMove();
                break;
        }
        
        if (index !== null) {
            this.makeMove(index);
        }
    }
    
    getRandomMove() {
        const availableMoves = this.board
            .map((cell, index) => cell === '' ? index : null)
            .filter(cell => cell !== null);
            
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    getBestMove() {
        let bestScore = -Infinity;
        let bestMove = null;
        
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'o';
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    minimax(board, depth, isMaximizing) {
        const scores = {
            o: 1,
            x: -1,
            tie: 0
        };
        
        const result = this.checkGameEnd();
        if (result !== null) {
            return scores[result];
        }
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'o';
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'x';
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] &&
                   this.board[a] === this.board[b] &&
                   this.board[a] === this.board[c];
        });
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    checkGameEnd() {
        if (this.checkWin()) {
            return this.currentPlayer;
        } else if (this.checkDraw()) {
            return 'tie';
        }
        return null;
    }
    
    endGame(isDraw) {
        this.gameActive = false;
        
        if (isDraw) {
            this.scores.ties++;
            this.winText.textContent = "It's a Draw!";
        } else {
            this.scores[this.currentPlayer]++;
            this.winText.textContent = `${this.currentPlayer.toUpperCase()} Wins!`;
        }
        
        this.updateScoreBoard();
        this.winMessage.classList.remove('hidden');
    }
    
    updateStatus() {
        this.statusElement.textContent = `Player ${this.currentPlayer.toUpperCase()}'s Turn`;
    }
    
    updateScoreBoard() {
        document.querySelector('.player-x span').textContent = this.scores.x;
        document.querySelector('.player-o span').textContent = this.scores.o;
        document.querySelector('.ties span:last-child').textContent = this.scores.ties;
    }
    
    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'x';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.className = 'cell';
            cell.innerHTML = '';
        });
        
        this.updateStatus();
        
        if (this.vsAI && this.currentPlayer === 'o') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    new TicTacToe();
}); 