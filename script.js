document.addEventListener('DOMContentLoaded', function() {
    // Elementi
    const telescopeImage = document.getElementById('telescope-image');
    const viewport = document.querySelector('.viewport');
    const loadingOverlay = document.querySelector('.loading-overlay');
    const objectName = document.getElementById('object-name');
    const objectDescription = document.getElementById('object-description');
    const currentDateEl = document.getElementById('current-date');
    const currentTimeEl = document.getElementById('current-time');
    
    // Stato
    let autoRotationInterval = null;
    let isAutoRotating = true;
    
    // Array di immagini celesti (aggiornate e senza API key)
    const celestialObjects = [
        {
            name: "Giove",
            url: "https://www.nasa.gov/wp-content/uploads/2023/03/jupapr3color-jd-170322.gif",
            description: "Il più grande pianeta del Sistema Solare."
        },
        {
            name: "Saturno",
            url: "https://solarsystem.nasa.gov/system/resources/detail_files/2490_stsci-h-p1943a-f_1200.jpg",
            description: "Il pianeta con gli anelli più spettacolari."
        },
        {
            name: "Marte",
            url: "https://mars.nasa.gov/system/resources/detail_files/25642_PIA24937-web.jpg",
            description: "Il pianeta rosso."
        },
        {
            name: "Luna",
            url: "https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004874/frames/730x730_1x1_30p/moon.jpg",
            description: "Il satellite naturale della Terra."
        },
        {
            name: "Sole",
            url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0171.jpg",
            description: "La stella al centro del nostro Sistema Solare."
        },
        {
            name: "Venere",
            url: "https://solarsystem.nasa.gov/system/stellar_items/image_files/2_feature_1600x900_venus.jpg",
            description: "Il pianeta più caldo del Sistema Solare."
        },
        {
            name: "Mercurio",
            url: "https://solarsystem.nasa.gov/system/resources/detail_files/771_PIA16853.jpg",
            description: "Il pianeta più vicino al Sole."
        },
        {
            name: "Urano",
            url: "https://solarsystem.nasa.gov/system/resources/detail_files/599_PIA18182.jpg",
            description: "Il settimo pianeta dal Sole."
        },
        {
            name: "Nettuno",
            url: "https://solarsystem.nasa.gov/system/resources/detail_files/611_PIA01492.jpg",
            description: "L'ottavo e più lontano pianeta dal Sole."
        }
    ];
    
    // Inizializza
    updateDateTime();
    setInterval(updateDateTime, 1000); // Aggiorna data e ora ogni secondo
    startAutoRotation();
    
    // Funzioni
    function updateDateTime() {
        const now = new Date();
        if (currentDateEl) currentDateEl.textContent = now.toLocaleDateString('it-IT');
        if (currentTimeEl) currentTimeEl.textContent = now.toLocaleTimeString('it-IT');
    }
    
    function showLoading() {
        if (loadingOverlay) loadingOverlay.classList.add('active');
    }
    
    function hideLoading() {
        if (loadingOverlay) loadingOverlay.classList.remove('active');
    }
    
    function getRandomCelestialObject() {
        const randomIndex = Math.floor(Math.random() * celestialObjects.length);
        return celestialObjects[randomIndex];
    }
    
    function updateImage() {
        showLoading();
        
        // Verifica che telescopeImage esista
        if (!telescopeImage) {
            console.error('Elemento telescopeImage non trovato!');
            hideLoading();
            return;
        }
        
        // Aggiungi timestamp per forzare l'aggiornamento dell'immagine
        const timestamp = new Date().getTime();
        const celestialObject = getRandomCelestialObject();
        const imageUrl = `${celestialObject.url}?t=${timestamp}`;
        
        console.log('Caricamento immagine:', imageUrl); // Debug
        
        // Applica effetto di transizione
        telescopeImage.classList.remove('image-transition');
        void telescopeImage.offsetWidth; // Forza reflow
        telescopeImage.classList.add('image-transition');
        
        // Aggiorna immagine
        telescopeImage.src = imageUrl;
        
        // Aggiorna informazioni
        if (objectName) objectName.textContent = celestialObject.name;
        if (objectDescription) objectDescription.textContent = celestialObject.description;
        
        // Aggiungi didascalia se non esiste
        let caption = document.querySelector('.image-caption');
        if (!caption && viewport) {
            caption = document.createElement('div');
            caption.className = 'image-caption';
            viewport.appendChild(caption);
        }
        if (caption) caption.textContent = celestialObject.name;
        
        // Gestisci evento di caricamento immagine
        telescopeImage.onload = function() {
            hideLoading();
            console.log('Immagine caricata con successo'); // Debug
        };
        
        telescopeImage.onerror = function() {
            hideLoading();
            console.error('Errore nel caricamento dell\'immagine:', imageUrl);
            // Prova con un'immagine di fallback
            telescopeImage.src = 'https://via.placeholder.com/800x600?text=Immagine+non+disponibile';
        };
    }
    
    function startAutoRotation() {
        // Esegui subito updateImage
        updateImage();
        
        // Imposta l'intervallo solo se non è già attivo
        if (!autoRotationInterval) {
            isAutoRotating = true;
            if (viewport) viewport.classList.add('auto-rotation-active');
            autoRotationInterval = setInterval(updateImage, 10000); // Cambia ogni 10 secondi
        }
    }
});