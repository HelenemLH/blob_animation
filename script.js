console.log("Script is running");

const blob = document.getElementById("blob");

// Initial position and direction of the blob
let blobX = 0;
let blobY = 0;
let velocityX = 300; // Initial horizontal speed (pixels per second)
let velocityY = 300; // Initial vertical speed (pixels per second)
let speedMultiplier = 1; // Multiplier for speed adjustments
let blobSize = 200; // Start size of the blob (10x the original size of 20px)
const maxBlobSize = 1600; // Maximum size of the blob (8x the original size)
const maxSpeed = 1000; // Define the maximum speed
const minSpeed = 50; // Define the minimum speed
let isStopped = false; // Flag to track if the blob is stopped
let rotation = 0; // Initial rotation angle of the blob
let isRotatingRight = false; // Flag to track if the blob is rotating to the right
let isRotatingLeft = false; // Flag to track if the blob is rotating to the left

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

    // Rotate the blob if rotation is active
    if (isRotatingRight) {
        rotation += 5; // Rotate to the right
    } else if (isRotatingLeft) {
        rotation -= 5; // Rotate to the left
    }

    // Apply the new position and rotation with a smooth sliding effect
    gsap.to(blob, {
        x: blobX,
        y: blobY,
        width: blobSize + "px", // Adjust the blob's width based on size
        height: blobSize + "px", // Adjust the blob's height based on size
        rotation: rotation, // Apply the rotation
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

// Event listeners for key presses to control velocity and rotation
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowUp":
            isStopped = false;
            if (velocityY < 0) {
                velocityY -= 100; // Increase upward speed if already moving up
            } else {
                velocityY = -300; // Start moving up
            }
            break;
        case "ArrowDown":
            isStopped = false;
            if (velocityY > 0) {
                velocityY += 100; // Increase downward speed if already moving down
            } else {
                velocityY = 300; // Start moving down
            }
            break;
        case "ArrowLeft":
            isStopped = false;
            if (velocityX < 0) {
                velocityX -= 100; // Increase leftward speed if already moving left
            } else {
                velocityX = -300; // Start moving left
            }
            break;
        case "ArrowRight":
            isStopped = false;
            if (velocityX > 0) {
                velocityX += 100; // Increase rightward speed if already moving right
            } else {
                velocityX = 300; // Start moving right
            }
            break;
        case "f": // Increase speed when 'F' is pressed or resume at maximum speed if stopped
            if (velocityX === 0 && velocityY === 0) {
                velocityX = maxSpeed * (Math.random() < 0.5 ? -1 : 1); // Resume with max speed in random direction
                velocityY = maxSpeed * (Math.random() < 0.5 ? -1 : 1); // Resume with max speed in random direction
                isStopped = false;
            } else {
                speedMultiplier += 0.1;
            }
            break;
        case "s": // Decrease speed when 'S' is pressed or resume at minimum speed if stopped
            if (velocityX === 0 && velocityY === 0) {
                velocityX = minSpeed * (Math.random() < 0.5 ? -1 : 1); // Resume with minimum speed in random direction
                velocityY = minSpeed * (Math.random() < 0.5 ? -1 : 1); // Resume with minimum speed in random direction
                isStopped = false;
            } else {
                speedMultiplier = Math.max(0.1, speedMultiplier - 0.1); // Prevents speedMultiplier from going below 0.1
            }
            break;
        case "x": // Start rotating the blob to the right when 'X' is pressed
            isRotatingRight = true;
            break;
        case "y": // Start rotating the blob to the left when 'Y' is pressed
            isRotatingLeft = true;
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
            // Align the blob to upright position
            rotation = 0; // Reset rotation to 0 degrees
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
        case "x": // Stop rotating the blob to the right when 'X' is released
            isRotatingRight = false;
            break;
        case "y": // Stop rotating the blob to the left when 'Y' is released
            isRotatingLeft = false;
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
    blobSize = Math.max(20, Math.min(blobSize, maxBlobSize)); // Restrict size between 20px and 1600px

    // Update blob size immediately
    blob.style.width = blobSize + "px";
    blob.style.height = blobSize + "px";
});
