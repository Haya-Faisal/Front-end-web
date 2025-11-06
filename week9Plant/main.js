const waterBtn = document.getElementById('waterBtn');
const resetBtn = document.getElementById('resetBtn');
const stem = document.getElementById('stem');
const flower = document.getElementById('flower');
const countDisplay = document.getElementById('count');
const messageDisplay = document.getElementById('message');
let flowers=[]
        
let waterCount = 0;
const messages = [
    "Your plant needs water to grow!",
    "Yay! The plant is sprouting!",
    "Keep watering! It's getting taller!",
    "Look at those leaves grow!",
    "Almost there! A little more water!",
    "Congratulations! Your plant has bloomed! 🌸"
];


document.getElementById("waterBtn").onclick=()=>waterCounter();

function waterCounter(){
    waterCount++;
    countDisplay.textContent = waterCount;
            
    // Grow the stem
    if (waterCount <= 15) {
        stem.style.height = (waterCount * 20) + 'px';
    }
            
    // Show flower after 5 waters
    if (waterCount >= 10) {
        // flower.style.display = 'block';
        createFlower(10);
    }
            
    // Update message
    let messageIndex = Math.min(waterCount, 5);
    messageDisplay.textContent = messages[messageIndex];
            
    // Add a little animation to the button
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 150);
};

document.getElementById("resetBtn").onclick=()=>resetBtn();

function reset(){
    waterCount = 0;
    countDisplay.textContent = waterCount;
    stem.style.height = '0px';
    flower.style.display = 'none';
    messageDisplay.textContent = messages[0];

    // Remove all flowers
    flowers.forEach(flower => {
        if (flower.element && flower.element.parentNode) {
            flower.element.parentNode.removeChild(flower.element);
        }
    });
    flowers = [];
    
    // Add a little animation to the button
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 150);
};

function createFlower(yPosition) {
    const flowerColors = [
        '#6A0572', '#AB83A1', '#5F4B8B', '#E69F9F'
    ];
    
    // Create flower element
    const flowerElement = document.createElement('div');
    flowerElement.className = 'flower';
    
    const flowerInner = document.createElement('div');
    flowerInner.className = 'flower-inner';
    
    const flowerCenter = document.createElement('div');
    flowerCenter.className = 'flower-center';
    
    flowerInner.appendChild(flowerCenter);
    flowerElement.appendChild(flowerInner);
    
    // Set flower color
    const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    flowerElement.style.color = color;
    
    // Position the flower on the stem at Y position 10
    const flowerHeight = 80 + yPosition; // 80 is the pot height
    flowerElement.style.bottom = flowerHeight + 'px';
    flowerElement.style.left = '50%';
    flowerElement.style.transform = 'translateX(-50%)';
    
    // Set size
    const size = 20;
    flowerInner.style.width = size + 'px';
    flowerInner.style.height = size + 'px';
    flowerCenter.style.width = size / 3 + 'px';
    flowerCenter.style.height = size / 3 + 'px';
    
    // Create petals
    const petalCount = 6;
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.width = size + 'px';
        petal.style.height = size / 2 + 'px';
        
        const angle = (i / petalCount) * Math.PI * 2;
        petal.style.transform = `rotate(${angle}rad) translateX(${size/2}px)`;
        
        flowerInner.appendChild(petal);
    }
    
    // Add to container
    plantContainer.appendChild(flowerElement);
    
    // Store flower data
    flowers.push({
        element: flowerElement,
        yPosition: yPosition
    });
    // Add animation
    flowerElement.style.transform = 'translateX(-50%) scale(0)';
    setTimeout(() => {
        flowerElement.style.transform = 'translateX(-50%) scale(1)';
        flowerElement.style.transition = 'transform 0.5s ease';
    }, 10);
}