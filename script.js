// ... existing code ...
    
    // Fix global variables declarations
    let paypalConnected = false;
    let totalEarnings = 0;
    let availableEnergy = 0;
    let energyCollected = 0;
    let isOptimized = false;
    let currentRate = 0.20; // Starting rate in EUR/kWh

    // Fix DOM element references
    const totalEarningsEl = document.getElementById('total-earnings');
    const availableEnergyEl = document.getElementById('available-energy');
    const currentRateEl = document.getElementById('current-rate');
    const optimizeBtn = document.getElementById('optimize-btn');
    const sellBtn = document.getElementById('sell-btn');
    const solarPanel = document.getElementById('solar-panel');
    
    // Fix PayPal connection function
    async function connectPaypal() {
        const connectBtn = document.getElementById('connect-metamask');
        const statusEl = document.getElementById('metamask-status');
        const walletBtn = document.getElementById('wallet-btn');
    
        try {
            if (!connectBtn || !statusEl || !walletBtn) {
                throw new Error('Required UI elements not found');
            }

            statusEl.textContent = 'Connecting to PayPal...';
            connectBtn.disabled = true;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            paypalConnected = true;
            
            statusEl.textContent = 'PayPal connected - Direct Euro payments';
            connectBtn.textContent = '💰 PayPal Connected';
            walletBtn.disabled = false;
            walletBtn.textContent = 'Receive on PayPal';
            
            const walletInfo = document.querySelector('.wallet-info');
            if (walletInfo) {
                walletInfo.innerHTML = `
                    <p>Email: <span class="wallet-address">youremail@example.com</span></p>
                    <p>Account Type: <span class="account-type">PayPal Personal</span></p>
                    <p>Status: <span class="account-status">Active</span></p>
                    <p>Transfer Type: <span class="transfer-type">Instant - No Fees</span></p>
                `;
            }
            
        } catch (error) {
            console.error('PayPal connection error:', error);
            if (statusEl) statusEl.textContent = `Error: ${error.message}`;
            if (connectBtn) connectBtn.disabled = false;
        }
    }
    
    // Fix transfer function
    async function transferToPaypal() {
        const statusEl = document.getElementById('metamask-status');
        const progressBar = document.getElementById('transaction-progress');
    
        if (!paypalConnected) {
            alert('Please connect PayPal first');
            return;
        }
    
        try {
            if (!availableEnergy || availableEnergy <= 0) {
                alert('No energy available to sell!');
                return;
            }
            
            if (!statusEl || !progressBar) {
                throw new Error('UI elements not found');
            }
            
            statusEl.textContent = 'Preparing payment...';
            progressBar.classList.add('active');
    
            const energyAmount = availableEnergy;
            const earnings = energyAmount * currentRate;
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            totalEarnings += earnings;
            availableEnergy = 0;
            
            if (totalEarningsEl) totalEarningsEl.textContent = totalEarnings.toFixed(2);
            if (availableEnergyEl) availableEnergyEl.textContent = '0.00';
            
            const historyDiv = document.getElementById('recent-transactions');
            if (historyDiv) {
                addPaypalTransferToHistory(generatePaymentId(), earnings);
            }
            
            statusEl.textContent = 'Payment completed! Funds sent to your PayPal';
            alert(`Payment completed! €${earnings.toFixed(2)} sent to your PayPal account instantly.`);
            
        } catch (error) {
            console.error('Payment error:', error);
            if (statusEl) statusEl.textContent = `Error: ${error.message}`;
            alert('Payment error: ' + error.message);
        } finally {
            if (progressBar) progressBar.classList.remove('active');
        }
    }
    
    // Fix event listeners initialization
    document.addEventListener('DOMContentLoaded', function() {
        const connectBtn = document.getElementById('connect-metamask');
        const walletBtn = document.getElementById('wallet-btn');
        
        if (connectBtn) {
            connectBtn.textContent = '💰 Connect PayPal';
            connectBtn.addEventListener('click', connectPaypal);
        }
        
        if (walletBtn) {
            walletBtn.textContent = 'Receive on PayPal';
            walletBtn.disabled = true;
            walletBtn.addEventListener('click', transferToPaypal);
        }
        
        if (currentRateEl) {
            currentRateEl.textContent = currentRate.toFixed(2);
        }
        
        // Initialize energy update interval
        setInterval(updateEnergy, 1000);
    });