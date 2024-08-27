console.log("Script is running");

const blob = document.getElementById("blob");

// starting position and direction of the blob
let blobX = 0;
let blobY = 0;
let velocityX = 300; // initial speed horizontally (pixels per sec)
let velocityY = 300; // initial speed vertically (pixels per sec)
let speedMultiplier = 1; // this is for adjusting speed
let blobSize = 200; // start size of the blob
const maxBlobSize = 1600; // max size blob can get
const minBlobSize = 50; // smallest the blob can shrink to
let isStopped = false; // flag for keeping track if blob is stopped
let rotation = 0; // starting rotation angle of the blob
let isRotatingRight = false; // flag to know if the blob is rotating right
let isRotatingLeft = false; // flag to know if the blob is rotating left

// function to update blob position and check if it hits walls
function updateBlobPosition(deltaTime) {
    const width = window.innerWidth - blob.offsetWidth;
    const height = window.innerHeight - blob.offsetHeight;

    // updating position using velocity and time passed
    blobX += velocityX * speedMultiplier * deltaTime;
    blobY += velocityY * speedMultiplier * deltaTime;

    // check if blob hits the walls and change direction if needed
    if (blobX <= 0 || blobX >= width) {
        velocityX *= -1; // change horizontal direction
        blobX = Math.max(0, Math.min(blobX, width)); // make sure blob stays inside the screen
        adjustBlobSize(); // change blob size when it bounces horizontally
    }
    if (blobY <= 0 || blobY >= height) {
        velocityY *= -1; // change vertical direction
        blobY = Math.max(0, Math.min(blobY, height)); // make sure blob stays inside the screen
        adjustBlobSize(); // change blob size when it bounces vertically
    }

    // rotate the blob if rotation is happening
    if (isRotatingRight) {
        rotation += 5; // rotate right
    } else if (isRotatingLeft) {
        rotation -= 5; // rotate left
    }

    // apply the new position and rotation with some smooth sliding effect
    gsap.to(blob, {
        x: blobX,
        y: blobY,
        width: blobSize + "px", // change blob width based on its size
        height: blobSize + "px", // change blob height based on its size
        rotation: rotation, // apply rotation
        duration: 0.1, // short time for quick response
        ease: "power3.out" // strong easing for smooth sliding
    });
}

// function to change blob size when it hits the walls
function adjustBlobSize() {
    // randomly pick whether to shrink or grow the blob
    const sizeChange = Math.random() < 0.5 ? -100 : 100; // bigger change to 100px for more noticeable effect
    blobSize = Math.max(minBlobSize, Math.min(maxBlobSize, blobSize + sizeChange));

    // update blob size right away
    blob.style.width = blobSize + "px";
    blob.style.height = blobSize + "px";
}

// function to keep updating blob position
function animateBlob() {
    let lastTime = 0;

    function animate(time) {
        const deltaTime = (time - lastTime) / 1000; // convert time to seconds
        lastTime = time;

        updateBlobPosition(deltaTime); // update position of blob based on time passed

        requestAnimationFrame(animate); // continue the animation loop
    }

    requestAnimationFrame(animate); // start the animation loop
}

// start the animation
animateBlob();

// key press listeners to control velocity and rotation
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowUp":
            isStopped = false;
            if (velocityY < 0) {
                velocityY -= 100; // increase upward speed if already moving up
            } else {
                velocityY = -300; // start moving up
            }
            break;
        case "ArrowDown":
            isStopped = false;
            if (velocityY > 0) {
                velocityY += 100; // increase downward speed if already moving down
            } else {
                velocityY = 300; // start moving down
            }
            break;
        case "ArrowLeft":
            isStopped = false;
            if (velocityX < 0) {
                velocityX -= 100; // increase left speed if already moving left
            } else {
                velocityX = -300; // start moving left
            }
            break;
        case "ArrowRight":
            isStopped = false;
            if (velocityX > 0) {
                velocityX += 100; // increase right speed if already moving right
            } else {
                velocityX = 300; // start moving right
            }
            break;
        case "f": // increase speed when 'f' is pressed, or start at max speed if blob is stopped
            if (velocityX === 0 && velocityY === 0) {
                velocityX = maxBlobSize * (Math.random() < 0.5 ? -1 : 1); // resume with max speed in random direction
                velocityY = maxBlobSize * (Math.random() < 0.5 ? -1 : 1); // resume with max speed in random direction
                isStopped = false;
            } else {
                speedMultiplier += 0.1;
            }
            break;
        case "s": // decrease speed when 's' is pressed, or start at min speed if blob is stopped
            if (velocityX === 0 && velocityY === 0) {
                velocityX = minBlobSize * (Math.random() < 0.5 ? -1 : 1); // resume with min speed in random direction
                velocityY = minBlobSize * (Math.random() < 0.5 ? -1 : 1); // resume with min speed in random direction
                isStopped = false;
            } else {
                speedMultiplier = Math.max(0.1, speedMultiplier - 0.3); // slow down faster by increasing the decrement
            }
            break;
        case "z": // toggle rotation to the right when 'z' is pressed
            isRotatingRight = !isRotatingRight;
            if (isRotatingRight) isRotatingLeft = false; // make sure left rotation stops if right rotation starts
            break;
        case "w": // toggle rotation to the left when 'w' is pressed
            isRotatingLeft = !isRotatingLeft;
            if (isRotatingLeft) isRotatingRight = false; // make sure right rotation stops if left rotation starts
            break;
        case " ":
            // stop/resume movement when spacebar is pressed
            if (velocityX === 0 && velocityY === 0) {
                isStopped = false;
                velocityX = 300 * (Math.random() < 0.5 ? -1 : 1); // random horizontal direction
                velocityY = 300 * (Math.random() < 0.5 ? -1 : 1); // random vertical direction
            } else {
                isStopped = true;
                velocityX = 0;
                velocityY = 0;
            }
            // align the blob to the upright position
            rotation = 0; // reset rotation to 0 degrees
            break;
    }
});

// listener for touchpad pinch-to-zoom or scroll gesture to resize the blob
document.addEventListener("wheel", function(event) {
    if (event.deltaY < 0) {
        blobSize -= 5; // shrink blob size when scrolling up
    } else if (event.deltaY > 0) {
        blobSize += 5; // grow blob size when scrolling down
    }

    // make sure blob size stays within reasonable limits
    blobSize = Math.max(minBlobSize, Math.min(blobSize, maxBlobSize)); // keep size between minBlobSize and maxBlobSize

    // update blob size right away
    blob.style.width = blobSize + "px";
    blob.style.height = blobSize + "px";
});
