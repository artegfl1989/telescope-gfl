document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let energyCollected = 0;
    let availableEnergy = 0;
    let totalEarnings = 0;
    let currentRate = 0.15; // Euro per kWh
    let isOptimized = false;
    let weatherCondition = 'sunny'; // Default weather
    
    // DOM elements
    const solarPanel = document.getElementById('solar-panel');
    const energyCollectedEl = document.getElementById('energy-collected');
    const availableEnergyEl = document.getElementById('available-energy');
    const totalEarningsEl = document.getElementById('total-earnings');
    const currentRateEl = document.getElementById('current-rate');
    const optimizeBtn = document.getElementById('optimize-btn');
    const sellBtn = document.getElementById('sell-btn');
    const weatherStatusEl = document.getElementById('weather-status');
    const sunPositionEl = document.getElementById('sun-position');
    const sunIndicator = document.getElementById('sun-indicator');
    
    // Create solar cells
    function createSolarCells() {
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            solarPanel.appendChild(cell);
        }
    }
    
    // Update sun position based on real time
    function updateSunPosition() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Calculate sun position (simplified model)
        // 0 hours = far left, 12 hours = top, 23 hours = far right
        let sunX, sunY;
        
        if (hours < 6 || hours >= 18) {
            // Night time - sun is below horizon
            sunX = (hours < 6) ? -50 : 150; // Off-screen
            sunY = 150; // Below panel
            weatherCondition = 'night';
        } else {
            // Day time
            const dayProgress = (hours - 6 + minutes/60) / 12; // 0 to 1 for 6am to 6pm
            sunX = dayProgress * 100; // 0% to 100% across
            sunY = 50 - Math.sin(dayProgress * Math.PI) * 100; // Arc from bottom to top to bottom
            
            // Randomly change weather conditions
            if (Math.random() < 0.01) { // 1% chance to change weather each update
                const conditions = ['sunny', 'partly cloudy', 'cloudy', 'rainy'];
                weatherCondition = conditions[Math.floor(Math.random() * conditions.length)];
            }
        }
        
        // Position the sun indicator
        sunIndicator.style.left = `${sunX}%`;
        sunIndicator.style.top = `${sunY}%`;
        
        // Update weather display
        updateWeatherDisplay();
        
        // Update panel angle if optimized
        if (isOptimized) {
            optimizePanelAngle(sunX, sunY);
        }
        
        // Collect energy based on sun position and weather
        collectEnergy(sunX, sunY);
    }
    
    // Update weather display
    function updateWeatherDisplay() {
        let weatherText, sunPositionText;
        
        switch(weatherCondition) {
            case 'sunny':
                weatherText = 'Soleggiato ☀️';
                break;
            case 'partly cloudy':
                weatherText = 'Parzialmente nuvoloso ⛅';
                break;
            case 'cloudy':
                weatherText = 'Nuvoloso ☁️';
                break;
            case 'rainy':
                weatherText = 'Piovoso 🌧️';
                break;
            case 'night':
                weatherText = 'Notte 🌙';
                break;
            default:
                weatherText = 'Sconosciuto';
        }
        
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        if (hours < 6 || hours >= 18) {
            sunPositionText = `Ora: ${hours}:${minutes} - Il sole è sotto l'orizzonte`;
        } else {
            sunPositionText = `Ora: ${hours}:${minutes} - Il sole è visibile`;
        }
        
        weatherStatusEl.textContent = weatherText;
        sunPositionEl.textContent = sunPositionText;
    }
    
    // Optimize panel angle to face the sun
    function optimizePanelAngle(sunX, sunY) {
        // Calculate angle to face the sun
        const panelCenterX = 50;
        const panelCenterY = 50;
        
        // Calculate angle between panel center and sun
        const angleRad = Math.atan2(sunY - panelCenterY, sunX - panelCenterX);
        const angleDeg = angleRad * (180 / Math.PI);
        
        // Apply rotation to panel
        solarPanel.style.transform = `rotateX(${-angleDeg}deg) rotateY(${angleDeg/2}deg)`;
    }
    
    // Collect energy based on sun position and weather
    function collectEnergy(sunX, sunY) {
        // Clear previous active cells
        document.querySelectorAll('.cell.collecting').forEach(cell => {
            cell.classList.remove('collecting');
        });
        
        // Don't collect at night
        if (weatherCondition === 'night') {
            return;
        }
        
        // Calculate energy collection rate based on weather
        let efficiencyMultiplier;
        switch(weatherCondition) {
            case 'sunny': efficiencyMultiplier = 1.0; break;
            case 'partly cloudy': efficiencyMultiplier = 0.7; break;
            case 'cloudy': efficiencyMultiplier = 0.3; break;
            case 'rainy': efficiencyMultiplier = 0.1; break;
            default: efficiencyMultiplier = 0;
        }
        
        // Additional multiplier if panel is optimized
        if (isOptimized) {
            efficiencyMultiplier *= 1.5;
        }
        
        // Calculate energy collected this cycle
        const baseEnergyRate = 0.01; // kWh per update
        const energyThisCycle = baseEnergyRate * efficiencyMultiplier;
        
        // Update total energy
        energyCollected += energyThisCycle;
        availableEnergy += energyThisCycle;
        
        // Update display
        energyCollectedEl.textContent = energyCollected.toFixed(2);
        availableEnergyEl.textContent = availableEnergy.toFixed(2);
        
        // Highlight active cells based on sun position
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const index = parseInt(cell.dataset.index);
            const row = Math.floor(index / 4);
            const col = index % 4;
            
            // Determine if this cell should be active based on sun position
            if (isOptimized || 
                (sunX >= col * 25 && sunX <= (col + 1) * 25 && 
                 sunY >= row * 25 && sunY <= (row + 1) * 25)) {
                cell.classList.add('collecting');
            }
        });
    }
    
    // Sell available energy
    function sellEnergy() {
        if (availableEnergy > 0) {
            const earnings = availableEnergy * currentRate;
            totalEarnings += earnings;
            
            // Update display
            totalEarningsEl.textContent = totalEarnings.toFixed(2);
            
            // Reset available energy
            availableEnergy = 0;
            availableEnergyEl.textContent = '0.00';
            
            // Fluctuate market rate
            updateMarketRate();
            
            alert(`Hai venduto ${availableEnergy.toFixed(2)} kWh per €${earnings.toFixed(2)}!`);
        } else {
            alert('Non hai energia disponibile da vendere!');
        }
    }
    
    // Update market rate with small fluctuations
    function updateMarketRate() {
        // Random fluctuation between -10% and +10%
        const fluctuation = 0.9 + Math.random() * 0.2;
        currentRate = Math.max(0.10, Math.min(0.30, currentRate * fluctuation));
        currentRateEl.textContent = currentRate.toFixed(2);
    }
    
    // Toggle panel optimization
    function toggleOptimization() {
        isOptimized = !isOptimized;
        
        if (isOptimized) {
            optimizeBtn.textContent = 'Disattiva Ottimizzazione';
            solarPanel.classList.add('optimized');
        } else {
            optimizeBtn.textContent = 'Ottimizza Pannello';
            solarPanel.classList.remove('optimized');
            solarPanel.style.transform = 'none';
        }
    }
    
    // Initialize the application
    function init() {
        createSolarCells();
        
        // Set up event listeners
        optimizeBtn.addEventListener('click', toggleOptimization);
        sellBtn.addEventListener('click', sellEnergy);
        
        // Start updating sun position
        updateSunPosition();
        setInterval(updateSunPosition, 3000); // Update every 3 seconds
        
        // Periodically update market rate
        setInterval(updateMarketRate, 60000); // Update every minute
    }
    
    // Start the app
    init();
});