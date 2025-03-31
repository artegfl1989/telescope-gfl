// Variables to store sensor data
let lightSensor = null;
let orientationData = { alpha: 0, beta: 0, gamma: 0 };
let isMonitoring = false;
let totalScreenTime = 0; // Total active screen time in seconds
let todayScreenTime = 0; // Today's active screen time in seconds
let screenTimeRate = 0.01; // Euro per minute of active screen time

// Energy generation variables
let totalEnergy = 0; // Total energy in kWh
let todayEnergy = 0; // Today's energy in kWh
let energyGenerationRate = 5; // kWh generated per cycle
let energyGenerationInterval = 50; // seconds per cycle
let energyRate = 0.15; // Euro per kWh
let lastEnergyGeneration = 0; // Timestamp of last energy generation

// Activity detection variables
let lastActivityTime = 0;
let inactivityThreshold = 30000; // 30 seconds of inactivity before considering screen inactive
let activityCheckInterval = null;

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
    recordActivity(); // Record user activity when orientation changes
}

// Update light reading display
function updateLightReading(lux) {
    if (!isMonitoring) return;
    
    lightValue.textContent = Math.round(lux);
    
    // Visual feedback
    if (lux > 50) { // Lower threshold to detect screen is on
        solarPanel.classList.add('active');
        recordActivity(); // Record user activity when light changes
    } else {
        solarPanel.classList.remove('active');
    }
}

// Record user activity
function recordActivity() {
    lastActivityTime = Date.now();
}

// Check if the device is still active
function checkActivity() {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityTime;
    
    // If there's been activity recently, count this as active screen time
    if (timeSinceLastActivity < inactivityThreshold) {
        // Add 1 second to screen time counters
        todayScreenTime += 1;
        totalScreenTime += 1;
        
        // Check if it's time to generate energy (every energyGenerationInterval seconds)
        if (totalScreenTime % energyGenerationInterval === 0) {
            generateEnergy();
        }
        
        // Update displays
        const todayMinutes = (todayScreenTime / 60).toFixed(2);
        const totalMinutes = (totalScreenTime / 60).toFixed(2);
        const earnings = (totalEnergy * energyRate).toFixed(2);
        
        todayEnergyEl.textContent = todayEnergy.toFixed(2);
        totalEnergyEl.textContent = totalEnergy.toFixed(2);
        energyValueEur.textContent = earnings;
        energyValue.textContent = (todayScreenTime / 60).toFixed(2);
        
        // Update PayPal link with current value
        updatePayPalLink();
    }
}

// Generate energy based on active screen time
function generateEnergy() {
    todayEnergy += energyGenerationRate;
    totalEnergy += energyGenerationRate;
    
    // Visual feedback for energy generation
    const energyFeedback = document.createElement('div');
    energyFeedback.className = 'energy-pulse';
    energyFeedback.textContent = `+${energyGenerationRate} kWh`;
    document.querySelector('.sensor-container').appendChild(energyFeedback);
    
    // Remove the feedback element after animation
    setTimeout(() => {
        energyFeedback.remove();
    }, 3000);
    
    console.log(`Generated ${energyGenerationRate} kWh of energy!`);
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
    lastActivityTime = Date.now();
    
    if (lightSensor) {
        lightSensor.start();
    }
    
    startButton.disabled = true;
    stopButton.disabled = false;
    solarPanel.classList.add('active');
    
    // Start activity tracking
    activityCheckInterval = setInterval(checkActivity, 1000);
    
    // Add event listeners for user interaction
    document.addEventListener('touchstart', recordActivity);
    document.addEventListener('touchmove', recordActivity);
    document.addEventListener('mousemove', recordActivity);
    document.addEventListener('keydown', recordActivity);
    
    // Keep screen on if possible
    if (navigator.wakeLock) {
        try {
            navigator.wakeLock.request('screen').then(lock => {
                console.log('Screen wake lock activated');
            }).catch(err => {
                console.error('Wake lock error:', err);
            });
        } catch (err) {
            console.error('Wake lock API not supported:', err);
        }
    }
    
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
    
    // Stop activity tracking
    clearInterval(activityCheckInterval);
    
    // Remove event listeners
    document.removeEventListener('touchstart', recordActivity);
    document.removeEventListener('touchmove', recordActivity);
    document.removeEventListener('mousemove', recordActivity);
    document.removeEventListener('keydown', recordActivity);
}

// Simulate sensor data for devices without sensors
function simulateSensorData() {
    if (!isMonitoring) return;
    
    // Simulate light sensor
    const time = new Date();
    const hour = time.getHours();
    
    // Simulate ambient light
    let lightLevel = 200 + Math.random() * 100; // Simulate screen-on light level
    
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
    // Add CSS for energy generation animation
    const style = document.createElement('style');
    style.textContent = `
        .energy-pulse {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 255, 0, 0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            font-weight: bold;
            animation: pulse-fade 3s forwards;
            z-index: 100;
        }
        
        @keyframes pulse-fade {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) translateY(-50px); }
        }
    `;
    document.head.appendChild(style);

    // Update UI text to reflect energy generation instead of screen time
    document.querySelector('header h1').textContent = 'Energy Generator';
    document.querySelector('header p').textContent = 'Genera energia mantenendo lo schermo attivo';
    document.querySelector('#stats-section h2').textContent = 'Statistiche Energia';
    document.querySelector('#stats-section .stat-box:nth-child(1) h3').textContent = 'kWh Oggi';
    document.querySelector('#stats-section .stat-box:nth-child(2) h3').textContent = 'kWh Totali';
    document.querySelector('#stats-section .stat-box:nth-child(3) h3').textContent = 'Valore Stimato';
    document.querySelector('#payment-section h2').textContent = 'Vendi la tua Energia';
    document.querySelector('#payment-section p').textContent = 'Basato sull\'energia generata, puoi vendere i kWh prodotti.';
    document.querySelector('#readings h2').textContent = 'Generatore Attivo';
    document.querySelector('#readings p:nth-child(2)').textContent = 'Luminosità: ';
    document.querySelector('#readings p:nth-child(3)').textContent = 'Orientamento: ';
    document.querySelector('#readings p:nth-child(4)').textContent = 'Minuti Attivi: ';
    
    // Set up event listeners
    startButton.addEventListener('click', startMonitoring);
    stopButton.addEventListener('click', stopMonitoring);
    amountInput.addEventListener('change', updatePayPalLink);
    
    // Initialize sensors
    requestSensorPermission();
    checkSensors();
    updatePayPalLink();
    
    // Load saved data from localStorage
    if (localStorage.getItem('energyGeneratorData')) {
        try {
            const data = JSON.parse(localStorage.getItem('energyGeneratorData'));
            totalScreenTime = data.totalScreenTime || 0;
            todayScreenTime = data.todayScreenTime || 0;
            totalEnergy = data.totalEnergy || 0;
            todayEnergy = data.todayEnergy || 0;
            
            todayEnergyEl.textContent = todayEnergy.toFixed(2);
            totalEnergyEl.textContent = totalEnergy.toFixed(2);
            energyValueEur.textContent = (totalEnergy * energyRate).toFixed(2);
            energyValue.textContent = (todayScreenTime / 60).toFixed(2);
        } catch (e) {
            console.error('Error loading saved data', e);
        }
    }
    
    // Save data periodically
    setInterval(() => {
        localStorage.setItem('energyGeneratorData', JSON.stringify({
            totalScreenTime,
            todayScreenTime,
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
        todayScreenTime = 0;
        todayEnergy = 0;
        todayEnergyEl.textContent = '0';
        
        // Set up daily reset
        setInterval(() => {
            todayScreenTime = 0;
            todayEnergy = 0;
            todayEnergyEl.textContent = '0';
        }, 24 * 60 * 60 * 1000);
    }, timeToMidnight);
    
    // Add visibility change detection
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && isMonitoring) {
            recordActivity();
        }
    });
});