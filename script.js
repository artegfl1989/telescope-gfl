// Variables to track earnings
let secondsActive = 0;
let energyGenerated = 0;
let valueGenerated = 0;
let transferButton = document.getElementById('transfer-funds');
let transferStatus = document.getElementById('transfer-status');
let transactionHistory = document.getElementById('transaction-history');
let copyWalletButton = document.getElementById('copy-wallet');
let connectWalletButton = document.getElementById('connect-wallet');
const walletAddress = 'SNDNpccEWukZ3fmERjcJ5J51iRXd8mVC9C';

// Update the timer and energy generation
function updateTimer() {
    secondsActive++;
    
    // Format time as HH:MM:SS
    const hours = Math.floor(secondsActive / 3600);
    const minutes = Math.floor((secondsActive % 3600) / 60);
    const seconds = secondsActive % 60;
    
    const timeString = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':');
    
    document.getElementById('time-active').textContent = timeString;
    
    // Every 50 seconds, generate energy
    if (secondsActive % 50 === 0 && secondsActive > 0) {
        generateEnergy();
    }
}

// ... existing code ...

// Funzione per gestire la connessione al wallet
async function connectWallet() {
    try {
        if (!window.solana) {
            throw new Error('Nessun wallet Solana trovato. Installa Phantom o un altro wallet compatibile.');
        }
        
        connectWalletButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connessione...';
        
        // Richiedi la connessione al wallet
        await window.solana.connect();
        
        // Ottieni l'indirizzo del wallet
        const publicKey = window.solana.publicKey.toString();
        
        // Mostra l'indirizzo del wallet connesso
        connectWalletButton.innerHTML = '<i class="fas fa-check-circle"></i> Wallet Connesso';
        connectWalletButton.disabled = true;
        
        // Abilita il pulsante di trasferimento se c'è valore da trasferire
        if (valueGenerated > 0) {
            transferButton.disabled = false;
        }
        
    } catch (error) {
        console.error('Errore durante la connessione al wallet:', error);
        connectWalletButton.innerHTML = '<i class="fas fa-plug"></i> Connetti Wallet';
        alert('Errore: ' + error.message);
    }
}

// Start the timer when the page loads
window.onload = function() {
    // Inizializza gli elementi DOM dopo che la pagina è caricata
    transferButton = document.getElementById('transfer-funds') || transferButton;
    transferStatus = document.getElementById('transfer-status') || transferStatus;
    transactionHistory = document.getElementById('transaction-history') || transactionHistory;
    copyWalletButton = document.getElementById('copy-wallet') || copyWalletButton;
    connectWalletButton = document.getElementById('connect-wallet') || connectWalletButton;
    
    // Carica la libreria Solana Web3.js
    loadSolanaWeb3();
    
    // Update the timer every second
    setInterval(updateTimer, 1000);
    
    // Add event listeners
    if (transferButton) {
        transferButton.addEventListener('click', processTransfer);
    }
    
    if (copyWalletButton) {
        copyWalletButton.addEventListener('click', copyWalletAddress);
    }
    
    if (connectWalletButton) {
        connectWalletButton.addEventListener('click', connectWallet);
    }
    
    // Initial display
    document.getElementById('time-active').textContent = '00:00:00';
    document.getElementById('energy-generated').textContent = '0 kWh';
    document.getElementById('value-generated').textContent = '0.00 €';
    
    if (transferButton) {
        transferButton.disabled = true;
    }
    
    // Load previous transactions
    loadTransactions();
};

// ... existing code ...