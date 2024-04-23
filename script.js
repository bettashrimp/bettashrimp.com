// Initialize Three.js scene
const scene = new THREE.Scene();

// Create cylinder geometry (your creature)
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32); // Adjust dimensions as needed
cylinderGeometry.rotateX(Math.PI / 2); // Rotate the cylinder along the X-axis
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color for now
const creature = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
creature.position.y = 2; // Raise the creature's starting height
scene.add(creature);

// Create axis guides for the creature (Red: X-axis, Green: Y-axis, Blue: Z-axis)
const creatureAxisHelper = new THREE.AxesHelper(1);
creature.add(creatureAxisHelper);

// Create riverbed geometry
const riverbedGeometry = new THREE.PlaneGeometry(20, 20, 10, 10); // Large plane for riverbed
const riverbedMaterial = new THREE.MeshBasicMaterial({ color: 0x654321 }); // Brown color for riverbed
const riverbed = new THREE.Mesh(riverbedGeometry, riverbedMaterial);
riverbed.rotation.x = -Math.PI / 2; // Rotate to lay flat on the ground
scene.add(riverbed);

// Initialize variables
let mouseX = 0;
let mouseY = 0;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Define sensitivity for yaw rotation
const sensitivityYaw = 0.002; // Adjust as needed for yaw rotation

// Define sensitivity for pitch rotation
const sensitivityPitch = 0.001; // Adjust as needed for pitch rotation

// Define movement speed
const movementSpeed = 0.1; // Adjust as needed for movement speed

// Define gravity force
const gravity = new THREE.Vector3(0, -0.001, 0); // Adjust gravity strength as needed

// Initialize camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set initial camera position relative to the back of the creature's body
const distance = 10; // Distance behind the creature
const height = 2; // Height above the creature
const yOffset = 0.1; // Adjust vertically to position the camera at the creature's eye level

// Initialize camera's spherical coordinates
let spherical = new THREE.Spherical(distance, 1, 0); // Distance, polar angle, azimuthal angle
let target = new THREE.Vector3(); // Target position for the camera

// Update camera's position based on spherical coordinates
updateCameraPosition();

// Look at the creature from the camera's position
camera.lookAt(creature.position);

// Initialize renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // Append renderer to document body

// Request pointer lock when the game starts
renderer.domElement.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
});

// Add event listener for pointer lock change
document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === renderer.domElement) {
        // If pointer is locked, hide the cursor
        renderer.domElement.style.cursor = 'none';
    } else {
        // If pointer is unlocked, show the cursor
        renderer.domElement.style.cursor = 'auto';
    }
});

// Mouse movement handling
document.addEventListener('mousemove', (event) => {
    // Update mouse position only if pointer is locked
    if (document.pointerLockElement === renderer.domElement) {
        mouseX -= event.movementX * sensitivityYaw; // Mouse movement for yaw
        mouseY -= event.movementY * sensitivityPitch; // Mouse movement for pitch

        // Clamp pitch rotation within bounds
        const maxPitch = Math.PI / 6; // 30 degrees in radians
        const minPitch = -Math.PI / 6;
        mouseY = THREE.MathUtils.clamp(mouseY, minPitch, maxPitch);
    }
});

// Main render loop
function animate() {
    requestAnimationFrame(animate);

    // Update movement based on keyboard input
    updateMovement();

    // Apply yaw rotation to the creature based on mouse movement
    creature.rotation.y += mouseX;

    // Update camera position based on creature's position and rotation
    updateCameraPosition();

    // Apply gravity if the creature is not on the riverbed
    if (!isCreatureOnRiverbed()) {
        creature.position.add(gravity);
    }

    // Reset mouse movement
    mouseX = 0;
    mouseY = 0;

    // Look at the creature from the camera's position
    camera.lookAt(creature.position);

    // Render the scene
    renderer.render(scene, camera);
}

// Keyboard input handling
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Function to handle key down events
function onKeyDown(event) {
    switch (event.key) {
        case 'w':
            moveForward = true;
            break;
        case 's':
            moveBackward = true;
            break;
        case 'a':
            moveLeft = true;
            break;
        case 'd':
            moveRight = true;
            break;
    }
}

// Function to handle key up events
function onKeyUp(event) {
    switch (event.key) {
        case 'w':
            moveForward = false;
            break;
        case 's':
            moveBackward = false;
            break;
        case 'a':
            moveLeft = false;
            break;
        case 'd':
            moveRight = false;
            break;
    }
}

// Function to update movement based on keyboard input
function updateMovement() {
    if (moveForward) {
        // Move the creature forward
        creature.translateZ(-movementSpeed);
    }
    if (moveBackward) {
        // Move the creature backward
        creature.translateZ(movementSpeed);
    }
    if (moveLeft) {
        // Move the creature left
        creature.translateX(-movementSpeed);
    }
    if (moveRight) {
        // Move the creature right
        creature.translateX(movementSpeed);
    }
}

// Function to update camera position based on creature's position and rotation
function updateCameraPosition() {
    spherical.phi += mouseY;
    spherical.theta += mouseX;
    spherical.makeSafe();

    // Calculate the target position based on creature's position
    target.setFromMatrixPosition(creature.matrixWorld);

    // Update camera position based on spherical coordinates
    const offset = new THREE.Vector3().setFromSpherical(spherical);
    camera.position.copy(target).add(offset);

    // Set camera's up vector to match the creature's up vector
    camera.up.set(0, 1, 0);
}

// Function to check if the creature is on the riverbed
function isCreatureOnRiverbed() {
    return creature.position.y <= 0.5; // Adjust the threshold as needed
}

// Start the animation loop
animate();
