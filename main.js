// Show loading screen
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'flex'; // Show loading screen
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none'; // Hide loading screen
}

// Update loading percentage
function updateLoadingPercentage(percentage) {
    const loadingPercentage = document.getElementById('loading-percentage');
    loadingPercentage.textContent = `${percentage}%`;
}

// Simulate loading process (for demonstration purposes)
function simulateLoading() {
    let percentage = 0;
    const interval = setInterval(() => {
        percentage += 10;
        updateLoadingPercentage(percentage);
        if (percentage >= 100) {
            clearInterval(interval);
            hideLoadingScreen();
        }
    }, 1000); // Increase the percentage every second (simulated)
}

// Initialize the game
function initGame() {
    showLoadingScreen(); // Show loading screen
    simulateLoading(); // Simulate loading process
}

// Run the game
function runGame() {
    initGame();
    // Other game logic...
}

// Start the game when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', runGame);
