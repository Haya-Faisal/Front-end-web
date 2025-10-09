let size = 20;
let scl = 100;
let speed = 0.01;
let noiseScale = 0.001;
let maxBoxes = 600;
let boxLifespan = 70;
let waveSpeed = 0.01;
let boxCreationThreshold = 8;
let boxCreationInterval = 4;

// Variables
let boxes = [];
let boxPool = [];
let timeOffset = 0;
let lastX = 0;
let lastY = 0;
let mouseVelocityX = 0;
let mouseVelocityY = 0;
let frameCounter = 0;
let lastProcessTime = 0;

// Grid for spatial partitioning
let grid = {};
let gridSize = 60;

const strokeColor = { r: 139, g: 4, b: 7 };

// Add to spatial grid
function addToGrid(box) {
  const cellX = Math.floor(box.x / gridSize);
  const cellY = Math.floor(box.y / gridSize);
  const cellKey = `${cellX},${cellY}`;

  if (!grid[cellKey]) {
    grid[cellKey] = [];
  }
  grid[cellKey].push(box);
}

// Remove from spatial grid
function removeFromGrid(box) {
  const cellX = Math.floor(box.x / gridSize);
  const cellY = Math.floor(box.y / gridSize);
  const cellKey = `${cellX},${cellY}`;

  if (grid[cellKey]) {
    const index = grid[cellKey].indexOf(box);
    if (index !== -1) {
      grid[cellKey].splice(index, 1);
    }
  }
}

// Get or create box (object pooling)
function getBox(x, y, z) {
  if (boxPool.length > 0) {
    const box = boxPool.pop();
    box.reset(x, y, z);
    return box;
  }
  return new Box(x, y, z);
}

// Class for individual boxes
class Box {
  constructor(x, y, z) {
    this.reset(x, y, z);
  }

  reset(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.angle = random(TWO_PI);
    this.scl = scl;
    this.speed = speed;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.randomFactor = random(0.7, 1.3);
    this.lifespan = boxLifespan;
    this.alpha = 160;
    this.initialOffset = random(20, 50);
    this.created = false;
    this.neighbors = [];
    this.neighborUpdateFrame = 0;

    // Add to spatial grid
    addToGrid(this);

    return this;
  }

  update() {
    this.lifespan--;

    if (!this.created) {
      this.initialOffset *= 0.8;
      if (this.initialOffset < 0.5) {
        this.created = true;
      }
    }

    if (this.lifespan < 80) {
      this.alpha = map(this.lifespan, 0, 80, 0, 160);
    }

    // Find neighbors only occasionally to improve performance
    if (
      this.neighbors.length === 0 ||
      frameCounter - this.neighborUpdateFrame > 20
    ) {
      this.findNeighborsEfficient();
      this.neighborUpdateFrame = frameCounter;
    }

    // Optimized noise calculation
    const noiseVal = noise(
      this.x * noiseScale + this.noiseOffsetX + timeOffset,
      this.y * noiseScale + this.noiseOffsetY + timeOffset
    );

    this.z = map(noiseVal, 0, 1, -this.scl, this.scl) * this.randomFactor;
    this.z += sin(this.angle + timeOffset * 2) * (this.scl / 3);

    // Influence from neighbors
    if (this.neighbors.length > 0) {
      let avgNeighborZ = 0;
      let activeNeighbors = 0;

      for (let i = 0; i < this.neighbors.length; i++) {
        const neighbor = this.neighbors[i];
        if (!neighbor.isDead()) {
          avgNeighborZ += neighbor.z;
          activeNeighbors++;
        }
      }

      if (activeNeighbors > 0) {
        avgNeighborZ /= activeNeighbors;
        this.z = lerp(this.z, (this.z + avgNeighborZ) / 2, 0.1);
      }
    }

    this.angle += this.speed * this.randomFactor;
  }

  findNeighborsEfficient() {
    this.neighbors = [];
    const cellX = Math.floor(this.x / gridSize);
    const cellY = Math.floor(this.y / gridSize);

    // Check nearby cells only
    for (let x = cellX - 1; x <= cellX + 1; x++) {
      for (let y = cellY - 1; y <= cellY + 1; y++) {
        const cellKey = `${x},${y}`;
        if (grid[cellKey]) {
          for (let i = 0; i < grid[cellKey].length; i++) {
            const box = grid[cellKey][i];
            if (box !== this) {
              const d = dist(this.x, this.y, box.x, box.y);
              if (d < 60) {
                this.neighbors.push(box);
                if (this.neighbors.length >= 5) return;
              }
            }
          }
        }
      }
    }
  }

  display() {
    // Simple frustum culling for performance
    if (
      this.x < -width / 2 - 50 ||
      this.x > width / 2 + 50 ||
      this.y < -height / 2 - 50 ||
      this.y > height / 2 + 50
    ) {
      return; // Skip drawing off-screen boxes
    }

    push();

    if (!this.created) {
      translate(this.x, this.y, this.z - this.initialOffset);
    } else {
      translate(this.x, this.y, this.z);
    }

    noFill();
    
    stroke(
      strokeColor.r,
      strokeColor.g,
      strokeColor.b,
      this.alpha
    );
    strokeWeight(map(this.z, -scl, scl, 0.8, 2.5));

    // Use simpler geometry for better performance
    box(size * 0.9);
    pop();
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);
  
  // Set up camera similar to original
  camera(0, 0, height * 0.8, 0, 0, 0, 0, 1, 0);

  lastX = mouseX;
  lastY = mouseY;
}

function draw() {
  background(0);
  frameCounter++;

  // Skip frames for performance if too many boxes
  const heavyLoad = boxes.length > 300;
  if (heavyLoad && frameCounter % 2 !== 0) {
    // Only update on every other frame when under heavy load
    timeOffset += waveSpeed;
    return;
  }

  ambientLight(100);
  directionalLight(255, 255, 255, 0, -1, -1);

  // Calculate mouse velocity (throttled)
  const currentTime = millis();
  if (currentTime - lastProcessTime > 16) {
    // ~60fps throttling
    mouseVelocityX = mouseX - lastX;
    mouseVelocityY = mouseY - lastY;
    lastX = mouseX;
    lastY = mouseY;
    lastProcessTime = currentTime;
  }

  // Only create boxes on some frames to reduce load
  if (
    (mouseIsPressed ||
      abs(mouseVelocityX) > 0.5 ||
      abs(mouseVelocityY) > 0.5) &&
    frameCounter % boxCreationInterval === 0
  ) {
    const x = mouseX - width / 2;
    const y = mouseY - height / 2;
    const mouseSpeed = abs(mouseVelocityX) + abs(mouseVelocityY);

    if (mouseSpeed > boxCreationThreshold) {
      let newBoxes = floor(
        map(mouseSpeed, boxCreationThreshold, 40, 1, 2)
      );
      if (random() < 0.7) newBoxes = 1;

      for (let i = 0; i < newBoxes; i++) {
        if (boxes.length < maxBoxes) {
          const scatter = map(mouseSpeed, 0, 40, 5, 30);
          const boxX = x + random(-scatter, scatter);
          const boxY = y + random(-scatter, scatter);
          boxes.push(getBox(boxX, boxY, 0));
        }
      }
    }
  }

  // Update all boxes
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update();
  }

  // Remove and display boxes
  for (let i = boxes.length - 1; i >= 0; i--) {
    boxes[i].display();

    if (boxes[i].isDead()) {
      removeFromGrid(boxes[i]); // Remove from spatial grid
      boxPool.push(boxes[i]); // Return to object pool
      boxes.splice(i, 1);
    }
  }

  // Create ripple less frequently
  if (random() < 0.003 && boxes.length > 10) {
    createRipple();
  }

  timeOffset += waveSpeed;
}

function createRipple() {
  if (boxes.length === 0) return;

  const centerIndex = floor(random(boxes.length));
  const centerBox = boxes[centerIndex];

  // Optimize by only checking nearby boxes using the grid
  const cellX = Math.floor(centerBox.x / gridSize);
  const cellY = Math.floor(centerBox.y / gridSize);

  for (let x = cellX - 2; x <= cellX + 2; x++) {
    for (let y = cellY - 2; y <= cellY + 2; y++) {
      const cellKey = `${x},${y}`;
      if (grid[cellKey]) {
        for (const box of grid[cellKey]) {
          const d = dist(centerBox.x, centerBox.y, box.x, box.y);
          if (d < 150) {
            const influence = map(d, 0, 150, 50, 0);
            box.z += influence;
          }
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  camera(0, 0, height * 0.8, 0, 0, 0, 0, 1, 0);
}

// Throttle mouse events for better performance
let lastMouseEventTime = 0;

function mouseMoved() {
  const now = millis();
  if (now - lastMouseEventTime < 32) {
    // ~30fps for mouse events
    return false;
  }
  lastMouseEventTime = now;

  const speed = abs(mouseX - pmouseX) + abs(mouseY - pmouseY);

  if (
    speed > boxCreationThreshold &&
    frameCounter % boxCreationInterval === 0
  ) {
    const x = mouseX - width / 2;
    const y = mouseY - height / 2;

    if (boxes.length < maxBoxes) {
      boxes.push(getBox(x + random(-10, 10), y + random(-10, 10), 0));
    }
  }
  return false;
}

function mouseDragged() {
  const now = millis();
  if (
    now - lastMouseEventTime < 32 ||
    frameCounter % boxCreationInterval !== 0
  ) {
    return false;
  }
  lastMouseEventTime = now;

  const x = mouseX - width / 2;
  const y = mouseY - height / 2;
  const dragSpeed = abs(mouseX - pmouseX) + abs(mouseY - pmouseY);

  if (dragSpeed > boxCreationThreshold) {
    const numBoxes = Math.min(2, Math.floor(dragSpeed / 15));

    for (let i = 0; i < numBoxes; i++) {
      if (boxes.length < maxBoxes) {
        const pathX = x + random(-8, 8);
        const pathY = y + random(-8, 8);
        boxes.push(getBox(pathX, pathY, 0));
      }
    }
  }
  return false;
}
