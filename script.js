let energiaTotale = 0;
let guadagno = 0;
const TARIFFA_PER_KWH = 0.15;

function aggiornaDisplay() {
    document.getElementById('current-energy').textContent = energiaTotale.toFixed(2);
    document.getElementById('earnings').textContent = guadagno.toFixed(2);
}

// Funzione per ottenere l'intensità della luce
async function getLightLevel() {
    if ('AmbientLightSensor' in window) {
        try {
            const sensor = new AmbientLightSensor();
            const reading = await sensor.read();
            return Math.min(reading / 1000, 1); // Normalizza il valore tra 0 e 1
        } catch (error) {
            console.error('Sensore di luce non disponibile:', error);
            return 0;
        }
    }
    return 0;
}

// Funzione per calcolare l'energia in base alla posizione del sole
async function calcolaEnergiaSolare() {
    const lightLevel = await getLightLevel();
    const energiaGenerata = lightLevel * 0.5; // Massimo 0.5 kWh per ciclo
    
    if (energiaGenerata > 0) {
        energiaTotale += energiaGenerata;
        guadagno = energiaTotale * TARIFFA_PER_KWH;
        
        document.querySelectorAll('.cell').forEach(cella => {
            cella.classList.add('active');
            setTimeout(() => cella.classList.remove('active'), 1000);
        });
        
        aggiornaDisplay();
    }
}

// Avvia il monitoraggio dell'energia solare
setInterval(calcolaEnergiaSolare, 5000); // Controlla ogni 5 secondi