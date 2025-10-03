class QuizGame {
    constructor() {
        // Cache DOM elements
        this.startScreen = document.querySelector('.start-screen');
        this.quizScreen = document.querySelector('.quiz-screen');
        this.resultScreen = document.querySelector('.result-screen');
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.startBtn = document.querySelector('.start-btn');
        this.questionEl = document.querySelector('.question');
        this.optionsEl = document.querySelector('.options');
        this.nextBtn = document.querySelector('.next-btn');
        this.progressBar = document.querySelector('.progress');
        this.questionNumber = document.querySelector('.question-number');
        this.timerEl = document.querySelector('.timer');
        this.scoreEl = document.querySelector('.score');
        this.finalScoreEl = document.querySelector('.final-score');
        this.totalTimeEl = document.querySelector('.total-time');
        this.accuracyEl = document.querySelector('.accuracy');
        this.retryBtn = document.querySelector('.retry-btn');
        this.homeBtn = document.querySelector('.home-btn');
        this.scoresListEl = document.querySelector('.scores-list');

        // Quiz state
        this.currentCategory = 'general';
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = 0;
        this.timer = null;
        this.selectedAnswer = null;

        // Questions data
        this.questionsData = {
            general: [
                {
                    question: "What is the capital of France?",
                    options: ["London", "Berlin", "Paris", "Madrid"],
                    correct: 2
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Saturn"],
                    correct: 1
                },
                {
                    question: "Who painted the Mona Lisa?",
                    options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
                    correct: 1
                },
                {
                    question: "What is the largest ocean on Earth?",
                    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                    correct: 3
                },
                {
                    question: "Which element has the chemical symbol 'Au'?",
                    options: ["Silver", "Gold", "Copper", "Iron"],
                    correct: 1
                }
            ],
            science: [
                {
                    question: "What is the hardest natural substance on Earth?",
                    options: ["Gold", "Iron", "Diamond", "Platinum"],
                    correct: 2
                },
                {
                    question: "What is the smallest unit of matter?",
                    options: ["Atom", "Molecule", "Cell", "Electron"],
                    correct: 0
                },
                {
                    question: "What is the speed of light?",
                    options: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"],
                    correct: 0
                },
                {
                    question: "Which gas do plants absorb from the atmosphere?",
                    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                    correct: 2
                },
                {
                    question: "What is the largest organ in the human body?",
                    options: ["Heart", "Brain", "Liver", "Skin"],
                    correct: 3
                }
            ],
            history: [
                {
                    question: "In which year did World War II end?",
                    options: ["1943", "1944", "1945", "1946"],
                    correct: 2
                },
                {
                    question: "Who was the first President of the United States?",
                    options: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"],
                    correct: 2
                },
                {
                    question: "Which ancient wonder was located in Egypt?",
                    options: ["Hanging Gardens", "Colossus of Rhodes", "Great Pyramid", "Temple of Artemis"],
                    correct: 2
                },
                {
                    question: "When did the French Revolution begin?",
                    options: ["1789", "1799", "1809", "1819"],
                    correct: 0
                },
                {
                    question: "Who was the first Emperor of China?",
                    options: ["Qin Shi Huang", "Sun Yat-sen", "Kublai Khan", "Wu Zetian"],
                    correct: 0
                }
            ],
            geography: [
                {
                    question: "What is the longest river in the world?",
                    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
                    correct: 1
                },
                {
                    question: "Which continent is the largest by land area?",
                    options: ["North America", "Africa", "Asia", "Antarctica"],
                    correct: 2
                },
                {
                    question: "What is the smallest country in the world?",
                    options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
                    correct: 2
                },
                {
                    question: "Which mountain range runs through South America?",
                    options: ["Rocky Mountains", "Alps", "Himalayas", "Andes"],
                    correct: 3
                },
                {
                    question: "What is the capital of Australia?",
                    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
                    correct: 2
                }
            ]
        };

        this.setupEventListeners();
        this.loadHighScores();
    }

    setupEventListeners() {
        // Category selection
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
            });
        });

        // Start button
        this.startBtn.addEventListener('click', () => this.startQuiz());

        // Next button
        this.nextBtn.addEventListener('click', () => this.nextQuestion());

        // Retry button
        this.retryBtn.addEventListener('click', () => {
            this.resultScreen.classList.add('hidden');
            this.startScreen.classList.remove('hidden');
        });

        // Home button
        this.homeBtn.addEventListener('click', () => {
            this.resultScreen.classList.add('hidden');
            this.startScreen.classList.remove('hidden');
        });
    }

    startQuiz() {
        this.questions = [...this.questionsData[this.currentCategory]];
        this.shuffleArray(this.questions);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = Date.now();
        
        this.startScreen.classList.add('hidden');
        this.quizScreen.classList.remove('hidden');
        
        this.updateScore();
        this.showQuestion();
        this.startTimer();
    }

    showQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        this.questionEl.textContent = question.question;
        
        // Update progress
        this.progressBar.style.width = `${(this.currentQuestionIndex + 1) / this.questions.length * 100}%`;
        this.questionNumber.textContent = `${this.currentQuestionIndex + 1}/${this.questions.length}`;
        
        // Create options
        this.optionsEl.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            button.addEventListener('click', () => this.selectAnswer(index));
            this.optionsEl.appendChild(button);
        });
        
        this.selectedAnswer = null;
        this.nextBtn.disabled = true;
    }

    selectAnswer(index) {
        if (this.selectedAnswer !== null) return;
        
        this.selectedAnswer = index;
        const options = this.optionsEl.children;
        const correctAnswer = this.questions[this.currentQuestionIndex].correct;
        
        options[index].classList.add('selected');
        
        setTimeout(() => {
            options[correctAnswer].classList.add('correct');
            if (index !== correctAnswer) {
                options[index].classList.add('wrong');
            } else {
                this.score += 20;
                this.updateScore();
            }
            this.nextBtn.disabled = false;
        }, 500);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endQuiz();
        } else {
            this.showQuestion();
        }
    }

    endQuiz() {
        clearInterval(this.timer);
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        const accuracy = (this.score / (this.questions.length * 20) * 100).toFixed(1);
        
        this.quizScreen.classList.add('hidden');
        this.resultScreen.classList.remove('hidden');
        
        this.finalScoreEl.textContent = this.score;
        this.totalTimeEl.textContent = this.formatTime(timeTaken);
        this.accuracyEl.textContent = `${accuracy}%`;
        
        this.saveHighScore({
            category: this.currentCategory,
            score: this.score,
            time: timeTaken,
            accuracy: parseFloat(accuracy),
            date: new Date().toISOString()
        });
    }

    startTimer() {
        const startTime = Date.now();
        this.timer = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            this.timerEl.textContent = this.formatTime(elapsedTime);
        }, 1000);
    }

    updateScore() {
        this.scoreEl.textContent = this.score;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    saveHighScore(score) {
        const highScores = JSON.parse(localStorage.getItem('quizHighScores')) || [];
        highScores.push(score);
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('quizHighScores', JSON.stringify(highScores.slice(0, 5)));
        this.loadHighScores();
    }

    loadHighScores() {
        const highScores = JSON.parse(localStorage.getItem('quizHighScores')) || [];
        this.scoresListEl.innerHTML = highScores.map(score => `
            <div class="score-item">
                <div class="score-info">
                    <span class="score-category">${score.category}</span>
                    <span class="score-points">${score.score} points</span>
                </div>
                <div class="score-stats">
                    <span>${score.accuracy}%</span>
                    <span>${this.formatTime(score.time)}</span>
                </div>
            </div>
        `).join('');
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    new QuizGame();
}); 