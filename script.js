// Variables to store sensor data
let lightSensor = null;
let orientationData = { alpha: 0, beta: 0, gamma: 0 };
let isMonitoring = false;
let totalEnergy = 0;
let todayEnergy = 0;
let energyRate = 0.15; // Euro per kWh

// DOM Elements
const lightValue = document.getElementById('light-value');
const orientationValue = document.getElementById('orientation-value');
const energyValue = document.getElementById('energy-value');
const todayEnergyEl = document.getElementById('today-energy');
const totalEnergyEl = document.getElementById('total-energy');
const energyValueEur = document.getElementById('energy-value-eur');
const startButton = document.getElementById('start-sensor');
const stopButton = document.getElementById('stop-sensor');
const solarPanel = document.querySelector('.panel-surface');
const amountInput = document.getElementById('amount');
const paypalLink = document.getElementById('paypal-link');

// Check if sensors are available
function checkSensors() {
    if ('AmbientLightSensor' in window) {
        try {
            lightSensor = new AmbientLightSensor();
            lightSensor.addEventListener('reading', () => {
                updateLightReading(lightSensor.illuminance);
            });
            lightSensor.addEventListener('error', (event) => {
                console.error(`Sensor error: ${event.error.name}`);
                alert('Errore nel sensore di luce. Assicurati che il tuo dispositivo supporti questa funzionalità.');
            });
        } catch (error) {
            console.error(`Sensor creation error: ${error}`);
            alert('Il tuo browser non supporta il sensore di luce o l\'accesso è stato negato.');
        }
    } else {
        console.warn('AmbientLightSensor not supported');
        // Fallback to device light event
        window.addEventListener('devicelight', (event) => {
            updateLightReading(event.value);
        });
    }

    // Device orientation
    if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleOrientation);
    } else {
        console.warn('DeviceOrientation not supported');
        alert('Il tuo dispositivo non supporta la rilevazione dell\'orientamento.');
    }
}

// Handle device orientation
function handleOrientation(event) {
    if (!isMonitoring) return;
    
    orientationData.alpha = event.alpha; // z-axis rotation [0,360)
    orientationData.beta = event.beta;   // x-axis rotation [-180,180]
    orientationData.gamma = event.gamma; // y-axis rotation [-90,90]
    
    updateOrientationDisplay();
    adjustSolarPanel();
}

// Update light reading display
function updateLightReading(lux) {
    if (!isMonitoring) return;
    
    lightValue.textContent = Math.round(lux);
    
    // Calculate potential energy based on light intensity
    // This is a simplified model for educational purposes
    const efficiency = 0.15; // 15% efficiency
    const panelArea = 1.6; // m²
    const energyPerHour = (lux * efficiency * panelArea) / 1000; // kWh
    
    energyValue.textContent = energyPerHour.toFixed(4);
    
    // Accumulate energy
    if (isMonitoring) {
        const increment = energyPerHour / 3600; // per second
        todayEnergy += increment;
        totalEnergy += increment;
        
        todayEnergyEl.textContent = todayEnergy.toFixed(4);
        totalEnergyEl.textContent = totalEnergy.toFixed(4);
        energyValueEur.textContent = (totalEnergy * energyRate).toFixed(2);
        
        // Update PayPal link with current value
        updatePayPalLink();
    }
    
    // Visual feedback
    if (lux > 500) {
        solarPanel.classList.add('active');
    } else {
        solarPanel.classList.remove('active');
    }
}

// Update orientation display
function updateOrientationDisplay() {
    const direction = getDirection(orientationData.alpha);
    orientationValue.textContent = `${direction} (α: ${Math.round(orientationData.alpha)}°, β: ${Math.round(orientationData.beta)}°, γ: ${Math.round(orientationData.gamma)}°)`;
}

// Get cardinal direction from alpha angle
function getDirection(alpha) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(alpha / 45) % 8];
}

// Adjust solar panel visual based on orientation
function adjustSolarPanel() {
    // Tilt the panel based on beta and gamma
    const betaAdjust = Math.max(-45, Math.min(45, orientationData.beta));
    const gammaAdjust = Math.max(-45, Math.min(45, orientationData.gamma));
    
    solarPanel.style.transform = `rotateX(${betaAdjust}deg) rotateY(${gammaAdjust}deg)`;
}

// Update PayPal link with current amount
function updatePayPalLink() {
    const amount = amountInput.value;
    const baseUrl = "https://paypal.me/artegfl";
    paypalLink.href = `${baseUrl}/${amount}?country.x=IT&locale.x=it_IT`;
}

// Start monitoring
function startMonitoring() {
    isMonitoring = true;
    
    if (lightSensor) {
        lightSensor.start();
    }
    
    startButton.disabled = true;
    stopButton.disabled = false;
    solarPanel.classList.add('active');
    
    // Simulate some initial readings if sensors aren't available
    if (!('AmbientLightSensor' in window) && !('DeviceLight' in window)) {
        simulateSensorData();
    }
}

// Stop monitoring
function stopMonitoring() {
    isMonitoring = false;
    
    if (lightSensor) {
        lightSensor.stop();
    }
    
    startButton.disabled = false;
    stopButton.disabled = true;
    solarPanel.classList.remove('active');
}

// Simulate sensor data for devices without sensors
function simulateSensorData() {
    if (!isMonitoring) return;
    
    // Simulate light sensor
    const time = new Date();
    const hour = time.getHours();
    
    // Simulate daylight cycle (more light during midday)
    let lightLevel = 0;
    if (hour >= 6 && hour <= 18) {
        // Daylight hours
        const midday = 12;
        const hourDiff = Math.abs(hour - midday);
        lightLevel = 1000 * (1 - hourDiff / 10) + Math.random() * 200;
    } else {
        // Night hours
        lightLevel = Math.random() * 50;
    }
    
    updateLightReading(lightLevel);
    
    // Simulate orientation changes
    orientationData.alpha = (orientationData.alpha + 1) % 360;
    orientationData.beta = 20 * Math.sin(Date.now() / 5000);
    orientationData.gamma = 20 * Math.cos(Date.now() / 5000);
    
    updateOrientationDisplay();
    adjustSolarPanel();
    
    setTimeout(simulateSensorData, 1000);
}

// Request permission for sensors
async function requestSensorPermission() {
    if (navigator.permissions) {
        try {
            const result = await navigator.permissions.query({ name: 'ambient-light-sensor' });
            if (result.state === 'denied') {
                alert('Permesso per il sensore di luce negato. Controlla le impostazioni del browser.');
            }
        } catch (error) {
            console.error('Permission API error:', error);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    startButton.addEventListener('click', startMonitoring);
    stopButton.addEventListener('click', stopMonitoring);
    amountInput.addEventListener('change', updatePayPalLink);
    
    // Initialize sensors
    requestSensorPermission();
    checkSensors();
    updatePayPalLink();
    
    // Load saved data from localStorage
    if (localStorage.getItem('solarAppData')) {
        try {
            const data = JSON.parse(localStorage.getItem('solarAppData'));
            totalEnergy = data.totalEnergy || 0;
            todayEnergy = data.todayEnergy || 0;
            
            todayEnergyEl.textContent = todayEnergy.toFixed(4);
            totalEnergyEl.textContent = totalEnergy.toFixed(4);
            energyValueEur.textContent = (totalEnergy * energyRate).toFixed(2);
        } catch (e) {
            console.error('Error loading saved data', e);
        }
    }
    
    // Save data periodically
    setInterval(() => {
        localStorage.setItem('solarAppData', JSON.stringify({
            totalEnergy,
            todayEnergy,
            lastUpdated: new Date().toISOString()
        }));
    }, 30000);
    
    // Reset daily energy at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeToMidnight = tomorrow - now;
    
    setTimeout(() => {
        todayEnergy = 0;
        todayEnergyEl.textContent = '0';
        
        // Set up daily reset
        setInterval(() => {
            todayEnergy = 0;
            todayEnergyEl.textContent = '0';
        }, 24 * 60 * 60 * 1000);
    }, timeToMidnight);
});