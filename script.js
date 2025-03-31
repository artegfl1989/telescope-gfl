document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let energyCollected = 0;
    let availableEnergy = 0;
    let totalEarnings = 0;
    let currentRate = 0.15; // Euro per kWh
    let isOptimized = false;
    let weatherCondition = 'sunny'; // Default weather
    let deviceOrientation = { alpha: 0, beta: 0, gamma: 0 };
    let lightLevel = 0;
    let walletAddress = 'SNDNpccEWukZ3fmERjcJ5J51iRXd8mVC9C'; // Your Solana wallet address
    
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
    const walletBtn = document.getElementById('wallet-btn');
    
    // Create solar cells
    function createSolarCells() {
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            solarPanel.appendChild(cell);
        }
    }
    
    // Request sensor permissions
    async function requestSensorPermissions() {
        try {
            // Request permission for device orientation
            if (typeof DeviceOrientationEvent !== 'undefined' && 
                typeof DeviceOrientationEvent.requestPermission === 'function') {
                const permissionState = await DeviceOrientationEvent.requestPermission();
                if (permissionState !== 'granted') {
                    alert('È necessario concedere l\'autorizzazione per l\'orientamento del dispositivo');
                    return false;
                }
            }
            
            // Request permission for ambient light sensor
            if ('AmbientLightSensor' in window) {
                try {
                    const sensor = new AmbientLightSensor();
                    await sensor.start();
                    sensor.stop();
                } catch (err) {
                    alert('È necessario concedere l\'autorizzazione per il sensore di luce');
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error('Errore durante la richiesta di autorizzazioni:', error);
            alert('Si è verificato un errore durante la richiesta di autorizzazioni: ' + error.message);
            return false;
        }
    }
    
    // Initialize sensors
    async function initSensors() {
        const permissionsGranted = await requestSensorPermissions();
        if (!permissionsGranted) {
            alert('L\'app funzionerà in modalità simulata poiché le autorizzazioni non sono state concesse');
            // Fall back to simulated mode
            setInterval(updateSunPosition, 3000);
            return;
        }
        
        // Initialize device orientation sensor
        window.addEventListener('deviceorientation', function(event) {
            deviceOrientation.alpha = event.alpha || 0; // Z-axis rotation [0, 360)
            deviceOrientation.beta = event.beta || 0;   // X-axis rotation [-180, 180)
            deviceOrientation.gamma = event.gamma || 0; // Y-axis rotation [-90, 90)
            
            // Update sun position based on device orientation
            updateSunPositionFromSensors();
        });
        
        // Initialize ambient light sensor if available
        if ('AmbientLightSensor' in window) {
            try {
                const lightSensor = new AmbientLightSensor();
                lightSensor.addEventListener('reading', () => {
                    lightLevel = lightSensor.illuminance;
                    updateWeatherFromLightSensor();
                });
                lightSensor.start();
            } catch (error) {
                console.error('Errore durante l\'inizializzazione del sensore di luce:', error);
                // Fall back to time-based light estimation
                setInterval(updateLightLevelFromTime, 5000);
            }
        } else {
            console.log('Sensore di luce non disponibile, utilizzo stima basata sul tempo');
            setInterval(updateLightLevelFromTime, 5000);
        }
        
        // Fallback for devices without sensors
        if (!window.DeviceOrientationEvent) {
            console.log('Sensori di orientamento non disponibili, utilizzo modalità simulata');
            setInterval(updateSunPosition, 3000);
        }
    }
    
    // Update light level based on time (fallback)
    function updateLightLevelFromTime() {
        const now = new Date();
        const hours = now.getHours();
        
        // Estimate light level based on time of day
        if (hours < 6 || hours >= 20) {
            lightLevel = 0; // Night
        } else if (hours < 8 || hours >= 18) {
            lightLevel = 50; // Dawn/Dusk
        } else if (hours >= 10 && hours < 16) {
            lightLevel = 1000; // Midday
        } else {
            lightLevel = 500; // Morning/Afternoon
        }
        
        updateWeatherFromLightSensor();
    }
    
    // Update weather condition based on light sensor
    function updateWeatherFromLightSensor() {
        // Determine weather based on light level
        if (lightLevel < 10) {
            weatherCondition = 'night';
        } else if (lightLevel < 200) {
            weatherCondition = 'rainy';
        } else if (lightLevel < 500) {
            weatherCondition = 'cloudy';
        } else if (lightLevel < 800) {
            weatherCondition = 'partly cloudy';
        } else {
            weatherCondition = 'sunny';
        }
        
        updateWeatherDisplay();
    }
    
    // Update sun position based on real time (fallback)
    function updateSunPosition() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Calculate sun position (simplified model)
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
    
    // Update sun position based on device sensors
    function updateSunPositionFromSensors() {
        // Use device orientation to determine sun position relative to device
        // Alpha (0-360): compass direction
        // Beta (-180 to 180): front-to-back tilt
        // Gamma (-90 to 90): left-to-right tilt
        
        // Normalize values to percentage for positioning
        const sunX = ((deviceOrientation.alpha / 360) * 100 + 50) % 100;
        const sunY = ((90 - deviceOrientation.beta) / 180) * 100;
        
        // Position the sun indicator
        sunIndicator.style.left = `${sunX}%`;
        sunIndicator.style.top = `${sunY}%`;
        
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
        
        if (weatherCondition === 'night') {
            sunPositionText = `Ora: ${hours}:${minutes} - Il sole è sotto l'orizzonte`;
        } else {
            sunPositionText = `Ora: ${hours}:${minutes} - Livello luce: ${lightLevel.toFixed(0)} lux`;
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
        
        // Calculate energy collected this cycle based on real light level
        const baseEnergyRate = 0.01; // kWh per update
        const lightFactor = Math.min(1, lightLevel / 1000); // Normalize light level
        const energyThisCycle = baseEnergyRate * efficiencyMultiplier * lightFactor;
        
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
            const energyAmount = availableEnergy;
            const earnings = energyAmount * currentRate;
            totalEarnings += earnings;
            
            // Update display
            totalEarningsEl.textContent = totalEarnings.toFixed(2);
            
            // Reset available energy
            availableEnergy = 0;
            availableEnergyEl.textContent = '0.00';
            
            // Fluctuate market rate
            updateMarketRate();
            
            // Connect to real payment system
            connectToPaymentSystem(energyAmount, earnings);
            
            alert(`Hai venduto ${energyAmount.toFixed(2)} kWh per €${earnings.toFixed(2)}!`);
        } else {
            alert('Non hai energia disponibile da vendere!');
        }
    }
    
    // Connect to payment system for real earnings
    function connectToPaymentSystem(energyAmount, earnings) {
        // Check if we're on a Xiaomi MIUI device
        const isXiaomiDevice = /MIUI/.test(navigator.userAgent);
        
        if (isXiaomiDevice) {
            // Try to use Xiaomi payment API if available
            if (typeof window.MiPaymentBridge !== 'undefined') {
                try {
                    // This is a placeholder for the Xiaomi payment API
                    // In a real implementation, you would integrate with their SDK
                    console.log('Connecting to Xiaomi payment system...');
                    
                    // Log transaction for demonstration
                    console.log(`Transaction: ${energyAmount.toFixed(2)} kWh sold for €${earnings.toFixed(2)}`);
                    
                    // Store transaction in local storage for persistence
                    saveTransaction(energyAmount, earnings);
                    
                    return true;
                } catch (error) {
                    console.error('Error connecting to Xiaomi payment system:', error);
                }
            }
        }
        
        // Fallback to web payment request API
        if ('PaymentRequest' in window) {
            try {
                const supportedPaymentMethods = [
                    {
                        supportedMethods: 'basic-card',
                        data: {
                            supportedNetworks: ['visa', 'mastercard'],
                            supportedTypes: ['debit', 'credit']
                        }
                    }
                ];
                
                const paymentDetails = {
                    total: {
                        label: 'Vendita Energia Solare',
                        amount: {
                            currency: 'EUR',
                            value: earnings.toFixed(2)
                        }
                    }
                };
                
                const options = {
                    requestPayerName: true,
                    requestPayerEmail: true
                };
                
                // This is just for demonstration - in a real app you would complete the payment
                console.log('Web Payment API would be triggered here with these details:', paymentDetails);
                
                // Store transaction in local storage
                saveTransaction(energyAmount, earnings);
                
                return true;
            } catch (error) {
                console.error('Error with Web Payment API:', error);
            }
        }
        
        // If all else fails, just store the transaction locally
        saveTransaction(energyAmount, earnings);
        return false;
    }
    
    // Save transaction to local storage
    function saveTransaction(energyAmount, earnings) {
        const transactions = JSON.parse(localStorage.getItem('solarTransactions') || '[]');
        transactions.push({
            date: new Date().toISOString(),
            energy: energyAmount,
            earnings: earnings,
            rate: currentRate
        });
        localStorage.setItem('solarTransactions', JSON.stringify(transactions));
    }
    
    // Update market rate with small fluctuations
    function updateMarketRate() {
        // Get real market rates if possible
        fetchRealMarketRates().then(rate => {
            if (rate) {
                currentRate = rate;
            } else {
                // Random fluctuation between -10% and +10%
                const fluctuation = 0.9 + Math.random() * 0.2;
                currentRate = Math.max(0.10, Math.min(0.30, currentRate * fluctuation));
            }
            currentRateEl.textContent = currentRate.toFixed(2);
        });
    }
    
    // Fetch real market rates from an API
    async function fetchRealMarketRates() {
        try {
            // Try to get real energy market rates
            // This is a placeholder - in a real app, you would connect to an actual API
            const response = await fetch('https://api.example.com/energy-market-rates');
            if (response.ok) {
                const data = await response.json();
                return data.rate;
            }
        } catch (error) {
            console.log('Could not fetch real market rates, using simulation');
        }
        return null;
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
    
    // Send earnings to wallet
    async function sendToWallet() {
        if (totalEarnings <= 0) {
            alert('Non hai guadagni da trasferire al wallet!');
            return;
        }
        
        try {
            // Show loading state
            walletBtn.disabled = true;
            walletBtn.textContent = 'Trasferimento in corso...';
            
            // Convert earnings to SolarCoin (fictional conversion rate: 1 EUR = 10 SolarCoin)
            const solarCoinAmount = totalEarnings * 10;
            
            // Check if we're on a Xiaomi MIUI device for native integration
            const isXiaomiDevice = /MIUI/.test(navigator.userAgent);
            
            if (isXiaomiDevice && window.MiWalletBridge) {
                // Use Xiaomi's native wallet integration if available
                await sendViaMiWallet(solarCoinAmount);
            } else if (window.solana && window.solana.isPhantom) {
                // Use Phantom wallet if available
                await sendViaPhantomWallet(solarCoinAmount);
            } else {
                // Use Web3 API as fallback
                await sendViaWeb3(solarCoinAmount);
            }
            
            // Record the transaction
            saveWalletTransaction(solarCoinAmount);
            
            // Reset total earnings after successful transfer
            const previousEarnings = totalEarnings;
            totalEarnings = 0;
            totalEarningsEl.textContent = '0.00';
            
            alert(`Trasferimento completato! ${(previousEarnings).toFixed(2)}€ (${solarCoinAmount.toFixed(2)} SolarCoin) inviati al wallet ${walletAddress}`);
        } catch (error) {
            console.error('Errore durante il trasferimento:', error);
            alert(`Errore durante il trasferimento: ${error.message}`);
        } finally {
            // Reset button state
            walletBtn.disabled = false;
            walletBtn.textContent = 'Invia al Wallet';
        }
    }
    
    // Send via Xiaomi wallet integration
    async function sendViaMiWallet(amount) {
        return new Promise((resolve, reject) => {
            try {
                console.log(`Sending ${amount} SolarCoin to ${walletAddress} via Xiaomi Wallet`);
                
                // This is a placeholder for Xiaomi wallet integration
                // In a real implementation, you would use their SDK
                setTimeout(() => {
                    // Simulate successful transaction
                    resolve({
                        txid: 'mi_' + Math.random().toString(36).substring(2, 15),
                        status: 'success'
                    });
                }, 2000);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // Send via Phantom wallet (Solana)
    async function sendViaPhantomWallet(amount) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(`Sending ${amount} SolarCoin to ${walletAddress} via Phantom Wallet`);
                
                // Check if Phantom wallet is connected
                const resp = await window.solana.connect();
                const publicKey = resp.publicKey.toString();
                
                // This is a placeholder for actual Solana transaction
                // In a real implementation, you would create and sign a transaction
                setTimeout(() => {
                    resolve({
                        txid: 'sol_' + Math.random().toString(36).substring(2, 15),
                        status: 'success'
                    });
                }, 2000);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // Send via Web3 API (fallback)
    async function sendViaWeb3(amount) {
        return new Promise((resolve, reject) => {
            try {
                console.log(`Sending ${amount} SolarCoin to ${walletAddress} via Web3`);
                
                // This is a placeholder for Web3 integration
                // In a real implementation, you would use a Web3 provider
                setTimeout(() => {
                    // Simulate successful transaction
                    resolve({
                        txid: 'web3_' + Math.random().toString(36).substring(2, 15),
                        status: 'success'
                    });
                }, 2000);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // Save wallet transaction to local storage
    function saveWalletTransaction(amount) {
        const transactions = JSON.parse(localStorage.getItem('walletTransactions') || '[]');
        transactions.push({
            date: new Date().toISOString(),
            amount: amount,
            wallet: walletAddress,
            txid: 'sc_' + Math.random().toString(36).substring(2, 15)
        });
        localStorage.setItem('walletTransactions', JSON.stringify(transactions));
    }
    
    // Initialize the application
    function init() {
        createSolarCells();
        
        // Set up event listeners
        optimizeBtn.addEventListener('click', toggleOptimization);
        sellBtn.addEventListener('click', sellEnergy);
        if (walletBtn) {
            walletBtn.addEventListener('click', sendToWallet);
        } else {
            console.error('Wallet button not found in the DOM');
        }
        
        // Initialize sensors
        initSensors();
        
        // Periodically update market rate
        setInterval(updateMarketRate, 60000); // Update every minute
    }
    
    // Start the app
    init();
});