console.log("Script is running");

const blob = document.getElementById("blob");

// Initial position and direction of the blob
let blobX = 0;
let blobY = 0;
let velocityX = 300; // Initial horizontal speed (pixels per second)
let velocityY = 300; // Initial vertical speed (pixels per second)
let speedMultiplier = 1; // Multiplier for speed adjustments
let blobSize = 200; // Start size of the blob (10x the original size of 20px)
const maxBlobSize = 1000; // Maximum size of the blob
let isStopped = false; // Flag to track if the blob is stopped

// Function to update the blob's position and check for collisions with the walls
function updateBlobPosition(deltaTime) {
    const width = window.innerWidth - blob.offsetWidth;
    const height = window.innerHeight - blob.offsetHeight;

    // Update position based on velocity and time passed
    blobX += velocityX * speedMultiplier * deltaTime;
    blobY += velocityY * speedMultiplier * deltaTime;

    // Check for collisions with the walls and reverse direction if necessary
    if (blobX <= 0 || blobX >= width) {
        velocityX *= -1; // Reverse horizontal direction
        blobX = Math.max(0, Math.min(blobX, width)); // Ensure blob stays within bounds
    }
    if (blobY <= 0 || blobY >= height) {
        velocityY *= -1; // Reverse vertical direction
        blobY = Math.max(0, Math.min(blobY, height)); // Ensure blob stays within bounds
    }

    // Apply the new position with a smooth sliding effect
    gsap.to(blob, {
        x: blobX,
        y: blobY,
        width: blobSize + "px", // Adjust the blob's width based on size
        height: blobSize + "px", // Adjust the blob's height based on size
        duration: 0.1, // Short duration for quick response
        ease: "power3.out" // Strong easing for a smooth slide
    });
}

// Function to continuously update the blob's position
function animateBlob() {
    let lastTime = 0;

    function animate(time) {
        const deltaTime = (time - lastTime) / 1000; // Convert to seconds
        lastTime = time;

        updateBlobPosition(deltaTime); // Update blob's position based on the time delta

        requestAnimationFrame(animate); // Continue the animation loop
    }

    requestAnimationFrame(animate); // Start the animation loop
}

// Start the animation
animateBlob();

// Event listeners for key presses to control velocity
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowUp":
            isStopped = false;
            velocityY = -300; // Start moving up
            break;
        case "ArrowDown":
            isStopped = false;
            velocityY = 300; // Start moving down
            break;
        case "ArrowLeft":
            isStopped = false;
            velocityX = -300; // Start moving left
            break;
        case "ArrowRight":
            isStopped = false;
            velocityX = 300; // Start moving right
            break;
        case "f": // Increase speed when 'F' is pressed
            speedMultiplier += 0.1;
            break;
        case "s": // Decrease speed when 'S' is pressed
            speedMultiplier = Math.max(0.1, speedMultiplier - 0.1); // Prevents speedMultiplier from going below 0.1
            break;
        case " ":
            // Toggle stop/resume movement when the spacebar is pressed
            if (velocityX === 0 && velocityY === 0) {
                isStopped = false;
                velocityX = 300 * (Math.random() < 0.5 ? -1 : 1); // Random horizontal direction
                velocityY = 300 * (Math.random() < 0.5 ? -1 : 1); // Random vertical direction
            } else {
                isStopped = true;
                velocityX = 0;
                velocityY = 0;
            }
            break;
    }
});

document.addEventListener("keyup", function(event) {
    switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
            // Reset to continuous movement
            if (velocityX === 0 && velocityY === 0) {
                isStopped = false;
                velocityX = 300 * (Math.random() < 0.5 ? -1 : 1); // Random direction
                velocityY = 300 * (Math.random() < 0.5 ? -1 : 1); // Random direction
            }
            break;
    }
});

// Event listener for touchpad pinch-to-zoom or scroll gesture to resize the blob
document.addEventListener("wheel", function(event) {
    if (event.deltaY < 0) {
        blobSize -= 5; // Decrease blob size when scrolling up
    } else if (event.deltaY > 0) {
        blobSize += 5; // Increase blob size when scrolling down
    }

    // Ensure blob size stays within reasonable limits
    blobSize = Math.max(20, Math.min(blobSize, maxBlobSize)); // Restrict size between 20px and 1000px

    // Update blob size immediately
    blob.style.width = blobSize + "px";
    blob.style.height = blobSize + "px";
});
