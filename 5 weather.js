document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "4c7c041c239d38e6d965564aef273f90";
    const form = document.getElementById("weather-form");
    const resultsDiv = document.getElementById("weather-results");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        // Get user selected city and date
        const city = document.getElementById("weather-city").value;
        const date = document.getElementById("weather-date").value;
        
        if (!city || !date) {
            alert("Please select a city and a date.");
            return;
        }

        try {
            // Call OpenWeather API
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );
            const data = await response.json();

            //API returns error code, prevent UI crash
            if (!response.ok || !data.weather || data.weather.length === 0) {
                console.error("API Error:", data);
                alert("Weather data not available for this city. Please try again later.");
                return;
            }

            //Update UI data
            document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            document.getElementById("temperature").innerText = `${data.main.temp}°C`;
            document.getElementById("weather-description").innerText = data.weather[0].description || "No description available";
            document.getElementById("humidity").innerText = `${data.main.humidity}%`;
            document.getElementById("wind-speed").innerText = `${data.wind.speed} km/h`;

            //Set best travel times
            const bestTimes = {
                "Bali,ID": "April - October",
                "Kyoto,JP": "March - May, October - November",
                "Swiss Alps,CH": "December - March (Skiing), June - September (Hiking)",
                "Costa Rica,CR": "December - April",
                "Rome,IT": "April - June, September - October",
                "New Zealand,NZ": "December - February",
                "Morocco,MA": "March - May, September - November",
                "Maldives,MV": "November - April"
            };

            const reasons = {
                "Bali,ID": "Best for beaches and cultural experiences.",
                "Kyoto,JP": "Best for cherry blossoms and autumn foliage.",
                "Swiss Alps,CH": "Best for skiing in winter and hiking in summer.",
                "Costa Rica,CR": "Best for nature and wildlife adventures.",
                "Rome,IT": "Best for sightseeing with mild weather.",
                "New Zealand,NZ": "Best for summer outdoor activities.",
                "Morocco,MA": "Best for desert trips and cultural experiences.",
                "Maldives,MV": "Best for relaxing on the beaches."
            };

            document.getElementById("best-months").innerHTML = `Best months: <span>${bestTimes[city] || "N/A"}</span>`;
            document.getElementById("visit-reason").innerText = reasons[city] || "No information available.";

            //Show weather results
            resultsDiv.classList.remove("d-none");

        } catch (error) {
            console.error("Fetch error:", error);
            alert("An error occurred while fetching weather data. Please try again.");
        }
    });
});