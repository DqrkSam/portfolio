class Timer {
    constructor() {
        // Cache DOM elements
        this.timeDisplay = document.querySelector('.time');
        this.progressRing = document.querySelector('.progress-ring-circle');
        this.startBtn = document.querySelector('.start-btn');
        this.resetBtn = document.querySelector('.reset-btn');
        this.settingsBtn = document.querySelector('.settings-btn');
        this.settingsPanel = document.querySelector('.settings-panel');
        this.saveSettingsBtn = document.querySelector('.save-settings-btn');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        
        // Timer state
        this.isRunning = false;
        this.timeLeft = 0;
        this.totalTime = 0;
        this.timerId = null;
        
        // Calculate progress ring properties
        const circle = this.progressRing;
        this.radius = circle.r.baseVal.value;
        this.circumference = this.radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        circle.style.strokeDashoffset = this.circumference;
        
        // Bind methods
        this.toggleTimer = this.toggleTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        this.saveSettings = this.saveSettings.bind(this);
        this.updateDisplay = this.updateDisplay.bind(this);
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', this.toggleTimer);
        this.resetBtn.addEventListener('click', this.resetTimer);
        this.settingsBtn.addEventListener('click', this.toggleSettings);
        this.saveSettingsBtn.addEventListener('click', this.saveSettings);
    }
    
    toggleTimer() {
        if (this.timeLeft === 0 && !this.isRunning) {
            this.saveSettings();
        }
        
        if (this.isRunning) {
            clearInterval(this.timerId);
            this.startBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.timerId = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                    this.updateDisplay();
                } else {
                    this.stopTimer();
                }
            }, 1000);
            this.startBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        
        this.isRunning = !this.isRunning;
    }
    
    stopTimer() {
        clearInterval(this.timerId);
        this.isRunning = false;
        this.startBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // Play notification sound
        const audio = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==');
        audio.play().catch(() => {});
    }
    
    resetTimer() {
        clearInterval(this.timerId);
        this.isRunning = false;
        this.startBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.timeLeft = this.totalTime;
        this.updateDisplay();
    }
    
    toggleSettings() {
        this.settingsPanel.classList.toggle('hidden');
    }
    
    saveSettings() {
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        this.totalTime = minutes * 60 + seconds;
        this.timeLeft = this.totalTime;
        this.settingsPanel.classList.add('hidden');
        this.updateDisplay();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress ring
        const progress = this.timeLeft / this.totalTime;
        const offset = this.circumference - (progress * this.circumference);
        this.progressRing.style.strokeDashoffset = offset;
    }
}

// Initialize timer when window loads
window.addEventListener('load', () => {
    new Timer();
}); 