class GalaxyGenerator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setCanvasSize();
        window.addEventListener('resize', () => this.setCanvasSize());
    }

    setCanvasSize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    generateRandomColor() {
        const hue = Math.random() * 360;
        const saturation = 70 + Math.random() * 30;
        const lightness = 40 + Math.random() * 20;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    generateGalaxy() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const galaxyType = Math.random();
        const baseColor = this.generateRandomColor();
        const secondaryColor = this.generateRandomColor();
        
        if (galaxyType < 0.33) {
            this.generateSpiralGalaxy(centerX, centerY, baseColor, secondaryColor);
        } else if (galaxyType < 0.66) {
            this.generateEllipticalGalaxy(centerX, centerY, baseColor);
        } else {
            this.generateIrregularGalaxy(centerX, centerY, baseColor, secondaryColor);
        }
    }

    generateSpiralGalaxy(centerX, centerY, baseColor, secondaryColor) {
        const arms = 2 + Math.floor(Math.random() * 4);
        const particles = 10000;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;

        for (let i = 0; i < particles; i++) {
            const distance = Math.random() * maxRadius;
            const angle = (Math.random() * Math.PI * 2) + (distance * 0.01);
            
            for (let arm = 0; arm < arms; arm++) {
                const armAngle = angle + (arm * ((Math.PI * 2) / arms));
                const x = centerX + Math.cos(armAngle) * distance;
                const y = centerY + Math.sin(armAngle) * distance;
                
                const size = Math.random() * 2;
                const alpha = (1 - distance / maxRadius) * 0.8;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fillStyle = Math.random() > 0.5 ? 
                    baseColor.replace(')', `, ${alpha})`) : 
                    secondaryColor.replace(')', `, ${alpha})`);
                this.ctx.fill();
            }
        }
    }

    generateEllipticalGalaxy(centerX, centerY, baseColor) {
        const particles = 8000;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
        const eccentricity = 0.5 + Math.random() * 0.5;

        for (let i = 0; i < particles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * maxRadius;
            
            const x = centerX + Math.cos(angle) * distance * eccentricity;
            const y = centerY + Math.sin(angle) * distance;
            
            const size = Math.random() * 2;
            const alpha = (1 - distance / maxRadius) * 0.8;

            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = baseColor.replace(')', `, ${alpha})`);
            this.ctx.fill();
        }
    }

    generateIrregularGalaxy(centerX, centerY, baseColor, secondaryColor) {
        const clusters = 3 + Math.floor(Math.random() * 4);
        const particlesPerCluster = 2000;

        for (let cluster = 0; cluster < clusters; cluster++) {
            const clusterX = centerX + (Math.random() - 0.5) * this.canvas.width * 0.4;
            const clusterY = centerY + (Math.random() - 0.5) * this.canvas.height * 0.4;
            const clusterRadius = Math.min(this.canvas.width, this.canvas.height) * 0.15;

            for (let i = 0; i < particlesPerCluster; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * clusterRadius;
                
                const x = clusterX + Math.cos(angle) * distance;
                const y = clusterY + Math.sin(angle) * distance;
                
                const size = Math.random() * 2;
                const alpha = (1 - distance / clusterRadius) * 0.8;

                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fillStyle = Math.random() > 0.6 ? 
                    baseColor.replace(')', `, ${alpha})`) : 
                    secondaryColor.replace(')', `, ${alpha})`);
                this.ctx.fill();
            }
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('galaxyCanvas');
    const galaxyGenerator = new GalaxyGenerator(canvas);
    
    // Generate initial galaxy
    galaxyGenerator.generateGalaxy();

    // Update datetime
    function updateDateTime() {
        const now = new Date();
        const dateTimeElement = document.getElementById('datetime');
        dateTimeElement.textContent = now.toLocaleString('it-IT', {
            dateStyle: 'full',
            timeStyle: 'medium'
        });
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Generate new galaxy button
    document.getElementById('generateGalaxy').addEventListener('click', () => {
        galaxyGenerator.generateGalaxy();
    });

    // Capture image button
    document.getElementById('captureImage').addEventListener('click', () => {
        const imageUrl = canvas.toDataURL('image/png');
        const galleryGrid = document.getElementById('galleryGrid');
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Galassia catturata';
        
        galleryItem.appendChild(img);
        galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
    });
});
