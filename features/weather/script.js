import config from './config.js';

class WeatherApp {
    constructor() {
        this.API_KEY = config.API_KEY;
        this.searchInput = document.querySelector('.search-box input');
        this.locationBtn = document.querySelector('.location-btn');
        this.weatherInfo = document.querySelector('.weather-info');
        this.forecastContainer = document.querySelector('.forecast-container');

        this.setupEventListeners();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);

        // Try to get user's location on startup
        this.getInitialLocation();
    }

    setupEventListeners() {
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.searchInput.value.trim()) {
                this.getWeather(this.searchInput.value.trim());
            }
        });

        this.locationBtn.addEventListener('click', () => this.getInitialLocation());

        // Add input validation
        this.searchInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            e.target.value = value.replace(/[^a-zA-Z\s,-]/g, '');
        });
    }

    getInitialLocation() {
        if (navigator.geolocation) {
            this.locationBtn.disabled = true;
            this.locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    this.getWeatherByCoords(latitude, longitude);
                },
                error => {
                    this.showError('Location access denied. Please search manually.');
                },
                { timeout: 10000 }
            );
        } else {
            this.showError('Geolocation is not supported by your browser.');
        }
    }

    async getWeather(city) {
        try {
            this.showLoading();

            // Get current weather
            const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.API_KEY}`
            );
            const weatherData = await weatherResponse.json();

            if (weatherData.cod === '404' || weatherData.cod === 404) {
                this.showError('City not found. Please try again.');
                return;
            }

            if (weatherData.cod !== 200) {
                this.showError(weatherData.message || 'An error occurred. Please try again.');
                return;
            }

            // Get 5-day forecast
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.API_KEY}`
            );
            const forecastData = await forecastResponse.json();

            if (forecastData.cod !== '200') {
                this.showError(forecastData.message || 'Error fetching forecast data.');
                return;
            }

            this.displayWeather(weatherData);
            this.displayForecast(forecastData);
            this.hideLoading();
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showError('An error occurred. Please check your internet connection and try again.');
        }
    }

    async getWeatherByCoords(lat, lon) {
        try {
            this.showLoading();

            // Get current weather
            const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}`
            );
            const weatherData = await weatherResponse.json();

            if (weatherData.cod !== 200) {
                this.showError(weatherData.message || 'An error occurred. Please try again.');
                return;
            }

            // Get 5-day forecast
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}`
            );
            const forecastData = await forecastResponse.json();

            if (forecastData.cod !== '200') {
                this.showError(forecastData.message || 'Error fetching forecast data.');
                return;
            }

            this.displayWeather(weatherData);
            this.displayForecast(forecastData);
            this.hideLoading();
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showError('An error occurred. Please check your internet connection and try again.');
        } finally {
            this.locationBtn.disabled = false;
            this.locationBtn.innerHTML = '<i class="fas fa-location-dot"></i>';
        }
    }

    displayWeather(data) {
        const {
            name,
            main: { temp, feels_like, humidity, pressure },
            weather: [{ description, icon }],
            wind: { speed }
        } = data;

        document.querySelector('.city').textContent = name;
        document.querySelector('.temperature').textContent = `${Math.round(temp)}°C`;
        document.querySelector('.feels-like').textContent = `Feels like: ${Math.round(feels_like)}°C`;
        document.querySelector('.weather-description').textContent = 
            description.charAt(0).toUpperCase() + description.slice(1);
        document.querySelector('.weather-icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        document.querySelector('.wind').textContent = `${Math.round(speed * 3.6)} km/h`;
        document.querySelector('.humidity').textContent = `${humidity}%`;
        document.querySelector('.pressure').textContent = `${pressure} hPa`;

        // Add weather-specific background
        this.updateBackground(icon);
    }

    displayForecast(data) {
        // Get one forecast per day (excluding today)
        const dailyForecasts = data.list.filter(forecast => 
            forecast.dt_txt.includes('12:00:00')
        ).slice(0, 5);

        this.forecastContainer.innerHTML = dailyForecasts.map(forecast => {
            const {
                dt_txt,
                main: { temp, humidity },
                weather: [{ icon, description }]
            } = forecast;

            const date = new Date(dt_txt);
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });

            return `
                <div class="forecast-item">
                    <div class="day">${day}</div>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
                    <div class="temp">${Math.round(temp)}°C</div>
                    <div class="humidity">${humidity}%</div>
                </div>
            `;
        }).join('');
    }

    updateDateTime() {
        const date = new Date();
        document.querySelector('.date').textContent = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    updateBackground(icon) {
        const timeOfDay = icon.includes('n') ? 'night' : 'day';
        const weatherType = icon.slice(0, 2);
        
        let bgClass = 'weather-clear';
        
        switch (weatherType) {
            case '01': // clear sky
                bgClass = `weather-clear-${timeOfDay}`;
                break;
            case '02': // few clouds
            case '03': // scattered clouds
            case '04': // broken clouds
                bgClass = `weather-cloudy-${timeOfDay}`;
                break;
            case '09': // shower rain
            case '10': // rain
                bgClass = `weather-rain-${timeOfDay}`;
                break;
            case '11': // thunderstorm
                bgClass = 'weather-storm';
                break;
            case '13': // snow
                bgClass = 'weather-snow';
                break;
            case '50': // mist
                bgClass = 'weather-mist';
                break;
        }
        
        document.body.className = bgClass;
    }

    showLoading() {
        this.weatherInfo.classList.add('loading');
    }

    hideLoading() {
        this.weatherInfo.classList.remove('loading');
    }

    showError(message) {
        this.hideLoading();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        this.weatherInfo.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Initialize app when window loads
window.addEventListener('load', () => {
    new WeatherApp();
}); 