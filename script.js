console.log("Script is running");

const blob = document.getElementById("blob");

// Initial position and direction of the blob
let blobX = 0;
let blobY = 0;
let velocityX = 300; // Initial horizontal speed (pixels per second)
let velocityY = 300; // Initial vertical speed (pixels per second)

// Function to update the blob's position and check for collisions with the walls
function updateBlobPosition(deltaTime) {
    const width = window.innerWidth - blob.offsetWidth;
    const height = window.innerHeight - blob.offsetHeight;

    // Update position based on velocity and time passed
    blobX += velocityX * deltaTime;
    blobY += velocityY * deltaTime;

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

// Event listener for arrow key presses to control velocity
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowUp":
            velocityY -= 100; // Increase upward speed
            break;
        case "ArrowDown":
            velocityY += 100; // Increase downward speed
            break;
        case "ArrowLeft":
            velocityX -= 100; // Increase leftward speed
            break;
        case "ArrowRight":
            velocityX += 100; // Increase rightward speed
            break;
    }
});
