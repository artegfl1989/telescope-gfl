// ... existing code ...

    // Update PayPal configuration
    const PAYPAL_CONFIG = {
        paypalMeLink: 'https://paypal.me/artegfl',
        currency: 'EUR',
        locale: 'it_IT'
    };
    
    async function transferToPaypal() {
        if (!paypalConnected) {
            alert('Please connect PayPal first');
            return;
        }

        try {
            if (!availableEnergy || availableEnergy <= 0) {
                alert('No energy available to transfer!');
                return;
            }
            
            const energyAmount = availableEnergy;
            const earnings = energyAmount * currentRate;
            
            // Create PayPal.me payment URL with amount
            const paypalMeUrl = `${PAYPAL_CONFIG.paypalMeLink}/${earnings.toFixed(2)}EUR`;
            
            // Open PayPal in new window
            window.open(paypalMeUrl, '_blank');
            
            // Update totals
            totalEarnings += earnings;
            availableEnergy = 0;
            
            if (totalEarningsEl) totalEarningsEl.textContent = totalEarnings.toFixed(2);
            if (availableEnergyEl) availableEnergyEl.textContent = '0.00';
            
            // Add to history
            const transferId = 'PP-' + Date.now();
            addPaypalTransferToHistory(transferId, earnings);
            
        } catch (error) {
            console.error('Transfer error:', error);
            alert('Transfer error: ' + error.message);
        }
    }

    // ... rest of the code remains unchanged ...