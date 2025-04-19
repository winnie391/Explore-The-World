/**
 * Weather Information Tool for Travel Website
 * Provides weather information and best time to visit recommendations
 */

// Initialize the weather information tool
document.addEventListener('DOMContentLoaded', function() {
    const weatherForm = document.getElementById('weather-form');
    const weatherResults = document.getElementById('weather-results');
    
    if (weatherForm) {
        // Set default date to today
        const weatherDate = document.getElementById('weather-date');
        if (weatherDate) {
            const today = new Date();
            weatherDate.value = today.toISOString().split('T')[0];
            
            // Set max date to 5 days ahead (weather forecast limitation)
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 5);
            weatherDate.max = maxDate.toISOString().split('T')[0];
        }
        
        // Handle form submission
        weatherForm.addEventListener('submit', function(event) {
            event.preventDefault();
            getWeatherInformation();
        });
    }
});

// Weather data by destination (best times to visit)
const destinationWeatherInfo = {
    'Bali,ID': {
        bestMonths: 'May to September',
        visitReason: 'The dry season offers sunny days with lower humidity, perfect for beach activities and exploring temples.',
        weatherApiCity: 'Denpasar',
        countryCode: 'ID'
    },
    'Kyoto,JP': {
        bestMonths: 'March to May and October to November',
        visitReason: 'Spring brings cherry blossoms, while autumn offers colorful foliage. Both seasons have mild temperatures ideal for sightseeing.',
        weatherApiCity: 'Kyoto',
        countryCode: 'JP'
    },
    'Swiss Alps,CH': {
        bestMonths: 'December to March (skiing) and June to September (hiking)',
        visitReason: 'Winter provides excellent snow conditions for winter sports, while summer offers pleasant hiking weather with alpine flowers in bloom.',
        weatherApiCity: 'Zermatt',
        countryCode: 'CH'
    },
    'Costa Rica,CR': {
        bestMonths: 'December to April',
        visitReason: 'The dry season offers sunny days ideal for beaches, rainforest exploration, and wildlife watching.',
        weatherApiCity: 'San Jose',
        countryCode: 'CR'
    },
    'Rome,IT': {
        bestMonths: 'April to June and September to October',
        visitReason: 'Spring and fall offer mild temperatures and fewer crowds, perfect for exploring ancient ruins and enjoying outdoor dining.',
        weatherApiCity: 'Rome',
        countryCode: 'IT'
    },
    'New Zealand,NZ': {
        bestMonths: 'December to February (summer) and June to August (skiing)',
        visitReason: 'Summer is ideal for hiking and outdoor activities, while winter offers excellent skiing conditions in the South Island.',
        weatherApiCity: 'Auckland',
        countryCode: 'NZ'
    },
    'Morocco,MA': {
        bestMonths: 'March to May and September to November',
        visitReason: 'Spring and fall offer comfortable temperatures for exploring cities, desert, and mountains without the extreme summer heat.',
        weatherApiCity: 'Marrakech',
        countryCode: 'MA'
    },
    'Maldives,MV': {
        bestMonths: 'November to April',
        visitReason: 'The dry season brings clear skies, calm seas, and excellent visibility for snorkeling and diving.',
        weatherApiCity: 'Malé',
        countryCode: 'MV'
    }
};

// Weather API key (replace with your actual API key)
const WEATHER_API_KEY = '4c7c041c239d38e6d965564aef273f90';

// Get weather information from API
async function getWeatherInformation() {
    const citySelect = document.getElementById('weather-city');
    const dateInput = document.getElementById('weather-date');
    
    const selectedCity = citySelect.value;
    const selectedDate = dateInput.value;
    
    if (!selectedCity || !selectedDate) {
        alert('Please select both a city and date.');
        return;
    }
    
    // Show loading state
    document.getElementById('weather-results').classList.add('d-none');
    const submitButton = document.querySelector('#weather-form button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
    submitButton.disabled = true;
    
    try {
        // Get city information
        const cityInfo = destinationWeatherInfo[selectedCity];
        if (!cityInfo) {
            throw new Error('City information not available');
        }
        
        // Calculate if we need current weather or forecast
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setHours(0, 0, 0, 0);
        
        const daysDifference = Math.floor((selectedDateObj - today) / (1000 * 60 * 60 * 24));
        
        let weatherData;
        let useMockData = false;
        
        try {
            if (daysDifference === 0) {
                // Get current weather
                weatherData = await getCurrentWeather(cityInfo.weatherApiCity, cityInfo.countryCode);
            } else if (daysDifference > 0 && daysDifference <= 5) {
                // Get forecast weather
                weatherData = await getForecastWeather(cityInfo.weatherApiCity, cityInfo.countryCode, daysDifference);
            } else if (daysDifference > 5) {
                // Date is too far in the future for API forecast, use mock data with disclaimer
                useMockData = true;
            } else {
                // Date is in the past
                throw new Error('Please select today or a future date');
            }
        } catch (apiError) {
            // API error occurred, fall back to mock data
            console.warn('API request failed, using mock data instead:', apiError);
            useMockData = true;
            
            // If it's a past date error, re-throw it
            if (apiError.message.includes('select today or a future date')) {
                throw apiError;
            }
        }
        
        // Use mock data if needed or if API failed
        if (useMockData) {
            weatherData = await getMockWeatherData(selectedCity);
            weatherData.isMockData = true;
            weatherData.isAPIError = daysDifference <= 5 && daysDifference >= 0;
            weatherData.date = selectedDateObj;
        }
        
        // Display weather information
        displayWeatherInfo(weatherData, cityInfo);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(`Could not fetch weather information: ${error.message || 'Unknown error'}`);
    } finally {
        // Reset button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
}

// Get current weather data
async function getCurrentWeather(city, countryCode) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${WEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        date: new Date()
    };
}

// Get forecast weather data
async function getForecastWeather(city, countryCode, dayIndex) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&appid=${WEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Find the forecast for the requested day (API returns data in 3-hour intervals)
    // We use noon (12:00) as a representative time for the day
    const forecastDate = new Date();
    forecastDate.setDate(forecastDate.getDate() + dayIndex);
    forecastDate.setHours(12, 0, 0, 0);
    
    // Find the closest time slot to noon for the requested day
    let closestForecast = null;
    let minTimeDiff = Infinity;
    
    for (const forecast of data.list) {
        const forecastTime = new Date(forecast.dt * 1000);
        const timeDiff = Math.abs(forecastTime - forecastDate);
        
        if (timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            closestForecast = forecast;
        }
    }
    
    if (!closestForecast) {
        throw new Error('Could not find forecast for selected date');
    }
    
    return {
        temperature: closestForecast.main.temp,
        description: closestForecast.weather[0].description,
        icon: closestForecast.weather[0].icon,
        humidity: closestForecast.main.humidity,
        windSpeed: closestForecast.wind.speed,
        date: new Date(closestForecast.dt * 1000)
    };
}

// Display weather information
function displayWeatherInfo(weatherData, cityInfo) {
    const weatherResults = document.getElementById('weather-results');
    
    if (weatherResults) {
        // Set weather icon
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;
        
        // Set temperature and description
        document.getElementById('temperature').textContent = `${Math.round(weatherData.temperature)}°C`;
        const description = document.getElementById('weather-description');
        description.textContent = weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1);
        
        // Add disclaimer for mock data
        if (weatherData.isMockData) {
            if (weatherData.isAPIError) {
                description.innerHTML += ' <span class="badge bg-secondary">Simulated</span>';
                description.insertAdjacentHTML('afterend', '<p class="text-muted small">Weather API is currently unavailable. Showing simulated weather data.</p>');
            } else {
                description.innerHTML += ' <span class="badge bg-warning text-dark">Estimated</span>';
                description.insertAdjacentHTML('afterend', '<p class="text-muted small">Weather data beyond 5 days is estimated based on typical conditions.</p>');
            }
        }
        
        // Set humidity and wind speed
        document.getElementById('humidity').textContent = `${weatherData.humidity}%`;
        document.getElementById('wind-speed').textContent = `${weatherData.windSpeed} m/s`;
        
        // Set best time to visit information
        document.getElementById('best-months').innerHTML = `Best months: <span class="fw-bold">${cityInfo.bestMonths}</span>`;
        document.getElementById('visit-reason').textContent = cityInfo.visitReason;
        
        // Show results
        weatherResults.classList.remove('d-none');
        
        // Scroll to results
        weatherResults.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mock weather data for offline development
const mockWeatherData = {
    'Bali,ID': {
        temperature: 28,
        description: 'partly cloudy',
        icon: '02d',
        humidity: 75,
        windSpeed: 3.5
    },
    'Kyoto,JP': {
        temperature: 21,
        description: 'clear sky',
        icon: '01d',
        humidity: 65,
        windSpeed: 2.1
    },
    'Swiss Alps,CH': {
        temperature: 8,
        description: 'light snow',
        icon: '13d',
        humidity: 80,
        windSpeed: 4.2
    }
};

// Function to use mock data when API is not available
function getMockWeatherData(city) {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            const data = mockWeatherData[city] || {
                temperature: 20,
                description: 'clear sky',
                icon: '01d',
                humidity: 60,
                windSpeed: 3.0
            };
            
            resolve({
                ...data,
                date: new Date()
            });
        }, 500);
    });
}

// Export for use in other modules
window.getWeatherInformation = getWeatherInformation; 