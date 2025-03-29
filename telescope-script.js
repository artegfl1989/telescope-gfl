// Astronomical object database (simulated)
const astronomicalObjects = {
    planets: [
        {
            id: 'mercury',
            name: 'Mercury',
            description: 'Mercury is the smallest and innermost planet in the Solar System.',
            distance: '77 million km',
            size: '4,879 km',
            images: [
                'https://images-assets.nasa.gov/image/PIA11245/PIA11245~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA16388/PIA16388~thumb.jpg'
            ]
        },
        {
            id: 'venus',
            name: 'Venus',
            description: 'Venus is the second planet from the Sun and is Earth\'s closest planetary neighbor.',
            distance: '261 million km',
            size: '12,104 km',
            images: [
                'https://images-assets.nasa.gov/image/PIA00072/PIA00072~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA00254/PIA00254~thumb.jpg'
            ]
        },
        {
            id: 'earth',
            name: 'Earth',
            description: 'Our home planet is the third planet from the Sun, and the only place we know of so far that\'s inhabited by living things.',
            distance: '0 km',
            size: '12,742 km',
            images: [
                'https://images-assets.nasa.gov/image/PIA18033/PIA18033~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA00123/PIA00123~thumb.jpg'
            ]
        },
        {
            id: 'mars',
            name: 'Mars',
            description: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System.',
            distance: '54.6 million km',
            size: '6,779 km',
            images: [
                'https://images-assets.nasa.gov/image/PIA00407/PIA00407~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA23302/PIA23302~thumb.jpg'
            ]
        },
        {
            id: 'jupiter',
            name: 'Jupiter',
            description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System.',
            distance: '588 million km',
            size: '139,820 km',
            images: [
                'https://images-assets.nasa.gov/image/PIA00343/PIA00343~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA02863/PIA02863~thumb.jpg'
            ]
        },
        {
            id: 'saturn',
            name: 'Saturn',
            description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.',
            distance: '1.2 billion km',
            size: '116,464 km',
            images: [
                'https://images-assets.nasa.gov/image/PIA12348/PIA12348~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA11141/PIA11141~thumb.jpg'
            ]
        },
        {
            id: 'uranus',
            name: 'Uranus',
            description: 'Uranus is the seventh planet from the Sun and has the third-largest diameter in our solar system.',
            distance: '2.6 billion km',
            size: '50,724 km',
            images: [
                'https://images-assets.nasa.gov/image/PIA18182/PIA18182~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA01391/PIA01391~thumb.jpg'
            ]
        },
        {
            id: 'neptune',
            name: 'Neptune',
            description: 'Neptune is the eighth and farthest-known Solar planet from the Sun.',
            distance: '4.3 billion km',
            size: '49,244 km',
            images: [
                'https://images-assets.nasa.gov/image/PIA01492/PIA01492~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA02245/PIA02245~thumb.jpg'
            ]
        }
    ],
    galaxies: [
        {
            id: 'milky-way',
            name: 'Milky Way',
            description: 'The Milky Way is the galaxy that contains our Solar System.',
            distance: '25,000 light-years from Earth to the center',
            size: '100,000 light-years in diameter',
            images: [
                'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001362/GSFC_20171208_Archive_e001362~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA19341/PIA19341~thumb.jpg'
            ]
        },
        {
            id: 'andromeda',
            name: 'Andromeda Galaxy',
            description: 'The Andromeda Galaxy is a spiral galaxy approximately 2.5 million light-years from Earth.',
            distance: '2.5 million light-years',
            size: '220,000 light-years in diameter',
            images: [
                'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000917/GSFC_20171208_Archive_e000917~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA15416/PIA15416~thumb.jpg'
            ]
        },
        {
            id: 'triangulum',
            name: 'Triangulum Galaxy',
            description: 'The Triangulum Galaxy is a spiral galaxy approximately 3 million light-years from Earth.',
            distance: '3 million light-years',
            size: '60,000 light-years in diameter',
            images: [
                'https://images-assets.nasa.gov/image/PIA04217/PIA04217~thumb.jpg',
                'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002151/GSFC_20171208_Archive_e002151~thumb.jpg'
            ]
        }
    ],
    nebulae: [
        {
            id: 'orion',
            name: 'Orion Nebula',
            description: 'The Orion Nebula is a diffuse nebula situated in the Milky Way.',
            distance: '1,344 light-years',
            size: '24 light-years across',
            images: [
                'https://images-assets.nasa.gov/image/PIA13008/PIA13008~thumb.jpg',
                'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001955/GSFC_20171208_Archive_e001955~thumb.jpg'
            ]
        },
        {
            id: 'crab',
            name: 'Crab Nebula',
            description: 'The Crab Nebula is a supernova remnant in the constellation of Taurus.',
            distance: '6,500 light-years',
            size: '11 light-years across',
            images: [
                'https://images-assets.nasa.gov/image/PIA21474/PIA21474~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA17563/PIA17563~thumb.jpg'
            ]
        }
    ],
    stars: [
        {
            id: 'sun',
            name: 'The Sun',
            description: 'The Sun is the star at the center of the Solar System.',
            distance: '149.6 million km',
            size: '1,391,000 km',
            images: [
                'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000393/GSFC_20171208_Archive_e000393~thumb.jpg',
                'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001861/GSFC_20171208_Archive_e001861~thumb.jpg'
            ]
        },
        {
            id: 'proxima-centauri',
            name: 'Proxima Centauri',
            description: 'Proxima Centauri is a small, low-mass star located 4.2465 light-years away from the Sun.',
            distance: '4.2465 light-years',
            size: '214,000 km',
            images: [
                'https://images-assets.nasa.gov/image/PIA19832/PIA19832~thumb.jpg',
                'https://images-assets.nasa.gov/image/PIA19821/PIA19821~thumb.jpg'
            ]
        }
    ]
};

// DOM elements
const telescopeImage = document.getElementById('telescope-image');
const objectName = document.getElementById('object-name');
const objectDescription = document.getElementById('object-description');
const distanceElement = document.getElementById('distance');
const sizeElement = document.getElementById('size');
const updateTimeElement = document.getElementById('update-time');
const currentDateElement = document.getElementById('current-date');
const currentTimeElement = document.getElementById('current-time');
const captureButton = document.getElementById('capture-btn');
const loadingOverlay = document.querySelector('.loading-overlay');
const recentImagesContainer = document.getElementById('recent-images');

// Update date and time
function updateDateTime() {
    const now = new Date();
    
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    
    currentDateElement.textContent = `Date: ${now.toLocaleDateString(undefined, dateOptions)}`;
    currentTimeElement.textContent = `Time: ${now.toLocaleTimeString(undefined, timeOptions)}`;
}

// Get a random object from the database
function getRandomObject() {
    // Get all categories
    const categories = Object.keys(astronomicalObjects);
    
    // Select a random category (planets, galaxies, nebulae, or stars)
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Get all objects in that category
    const objectsInCategory = astronomicalObjects[randomCategory];
    
    // Select a random object from the category
    const randomObject = objectsInCategory[Math.floor(Math.random() * objectsInCategory.length)];
    
    return {
        category: randomCategory,
        object: randomObject
    };
}

// Update telescope view with a random object
function updateTelescopeView() {
    // Show loading overlay
    loadingOverlay.classList.add('active');
    
    setTimeout(() => {
        const randomSelection = getRandomObject();
        const selectedObject = randomSelection.object;
        
        if (selectedObject) {
            // Randomly select one of the available images
            const randomIndex = Math.floor(Math.random() * selectedObject.images.length);
            telescopeImage.src = selectedObject.images[randomIndex];
            
            objectName.textContent = selectedObject.name;
            objectDescription.textContent = selectedObject.description;
            distanceElement.textContent = `Distance from Earth: ${selectedObject.distance}`;
            sizeElement.textContent = `Diameter: ${selectedObject.size}`;
            
            const now = new Date();
            updateTimeElement.textContent = `Just now (${now.toLocaleTimeString()})`;
            
            // Automatically add to recent images
            addToRecentImages(selectedObject.images[randomIndex], selectedObject.name);
        }
        
        // Hide loading overlay after a delay
        setTimeout(() => {
            loadingOverlay.classList.remove('active');
        }, 500);
    }, 1500); // Simulate telescope adjustment time
}

// Add a captured image to the recent images gallery
function addToRecentImages(src, name) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'recent-image';
    
    const image = document.createElement('img');
    image.src = src;
    image.alt = name;
    
    imageContainer.appendChild(image);
    imageContainer.title = `${name} - ${new Date().toLocaleTimeString()}`;
    
    // Add click event to display the image in the main viewport
    imageContainer.addEventListener('click', () => {
        telescopeImage.src = src;
        objectName.textContent = name;
    });
    
    // Insert at the beginning
    recentImagesContainer.insertBefore(imageContainer, recentImagesContainer.firstChild);
    
    // Limit to 12 recent images
    if (recentImagesContainer.children.length > 12) {
        recentImagesContainer.removeChild(recentImagesContainer.lastChild);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Hide the selectors from the HTML since we're not using them
    const controls = document.querySelector('.controls');
    if (controls) {
        controls.style.display = 'none';
    }
    
    // Initial update
    updateTelescopeView();
    
    // Simulate periodic updates every 30 seconds
    setInterval(updateTelescopeView, 30000);
    
    // Keep the capture button if it exists
    if (captureButton) {
        captureButton.addEventListener('click', () => {
            // Just take the current image
            addToRecentImages(telescopeImage.src, objectName.textContent);
        });
    }
});