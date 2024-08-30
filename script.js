// grab the blob element by its id
const blob = document.getElementById("blob");

// Set up the pink blob element
let pinkBlob = null;

// set up initial variables for blob's position, speed, size, and state
let blobX = 0;  // starting x position
let blobY = 0;  // starting y position
let velocityX = 600;  // horizontal speed, kinda fast
let velocityY = 600;  // vertical speed, same as horizontal
let speedMultiplier = 1;  // we'll use this to adjust the speed up or down
let blobSize = 500;  // starting size of the blob
const maxBlobSize = 3100;  // max size it can grow to, like huge
const minBlobSize = 50;  // min size it can shrink to, like tiny
let isStopped = false;  // is the blob moving or not?
let rotation = 0;  // start rotation angle, it's flat at the beginning
let isRotatingRight = false;  // is the blob rotating right?
let isRotatingLeft = false;  // or is it rotating left?

// Pink blob variables
let pinkBlobX = 0;
let pinkBlobY = 0;
let pinkVelocityX = 400;  // pink blob speed
let pinkVelocityY = 400;

// Alternating images
let currentBlobImage = 'blob.png';
let alternateBlobImage = 'blob2.png';
let isBlobImageToggled = false;

// Function to alternate blob images continuously
function startAlternatingBlobImages() {
    setInterval(() => {
        isBlobImageToggled = !isBlobImageToggled;
        blob.src = isBlobImageToggled ? alternateBlobImage : currentBlobImage;
    }, 500);  // Change every 500ms (0.5 seconds)
}

function updatePinkBlobPosition(deltaTime) {
    const width = window.innerWidth - pinkBlob.offsetWidth;
    const height = window.innerHeight - pinkBlob.offsetHeight;

    // Update x and y position based on velocity and time passed
    pinkBlobX += pinkVelocityX * deltaTime;
    pinkBlobY += pinkVelocityY * deltaTime;

    // Check if pink blob hits the edges of the screen and bounce back
    if (pinkBlobX <= 0 || pinkBlobX >= width) {
        pinkVelocityX *= -1;  // reverse direction horizontally
        pinkBlobX = Math.max(0, Math.min(pinkBlobX, width));  // keep it within bounds
    }

    if (pinkBlobY <= 0 || pinkBlobY >= height) {
        pinkVelocityY *= -1;  // reverse direction vertically
        pinkBlobY = Math.max(0, Math.min(pinkBlobY, height));  // keep it within bounds
    }

    // Apply the new position using gsap for smooth animation
    gsap.to(pinkBlob, {
        x: pinkBlobX,
        y: pinkBlobY,
        duration: 0.1,
        ease: "power3.out"
    });
}

// Function to save the blob's state to localStorage
function saveBlobState() {
    const blobState = {
        blobX: blobX,
        blobY: blobY,
        blobSize: blobSize,
        rotation: rotation,
        isStopped: isStopped,
        velocityX: velocityX,
        velocityY: velocityY
    };
    localStorage.setItem('blobState', JSON.stringify(blobState));
}

// Function to load the blob's state from localStorage
function loadBlobState() {
    const savedState = localStorage.getItem('blobState');
    if (savedState) {
        const blobState = JSON.parse(savedState);
        blobX = blobState.blobX || 0;
        blobY = blobState.blobY || 0;
        blobSize = blobState.blobSize || 500;
        rotation = blobState.rotation || 0;
        isStopped = blobState.isStopped || false;
        velocityX = blobState.velocityX || 600;
        velocityY = blobState.velocityY || 600;
    }
}

// Load saved state when the page loads
loadBlobState();

// this function updates the blob's position, size, and rotation on the screen
function updateBlobPosition(deltaTime) {
    const width = window.innerWidth - blob.offsetWidth;  // calculate available width minus the blob's width
    const height = window.innerHeight - blob.offsetHeight;  // calculate available height minus the blob's height

    // only move if the blob isn't stopped
    if (!isStopped) {
        // update x and y position based on velocity and how much time passed
        blobX += velocityX * speedMultiplier * deltaTime;
        blobY += velocityY * speedMultiplier * deltaTime;

        // check if blob hits the left or right edge of the screen
        if (blobX <= 0 || blobX >= width) {
            velocityX *= -1;  // reverse direction horizontally
            blobX = Math.max(0, Math.min(blobX, width));  // make sure it stays within screen bounds
            adjustBlobSize();  // maybe change blob's size when it hits an edge
        }

        // check if blob hits the top or bottom edge of the screen
        if (blobY <= 0 || blobY >= height) {
            velocityY *= -1;  // reverse direction vertically
            blobY = Math.max(0, Math.min(blobY, height));  // make sure it stays within screen bounds
            adjustBlobSize();  // maybe change blob's size when it hits an edge
        }

        // handle rotation if user pressed the rotate keys
        if (isRotatingRight) {
            rotation += 5;  // rotate right (clockwise)
        } else if (isRotatingLeft) {
            rotation -= 5;  // rotate left (counterclockwise)
        }
    }

    // apply the new position, size, and rotation using gsap for smooth animation
    gsap.to(blob, {
        x: blobX,
        y: blobY,
        width: blobSize + "px",
        height: blobSize + "px",
        rotation: rotation,
        duration: 0.1,
        ease: "power3.out"
    });

    // update the position and size of all other images (like heart, burger, etc.)
    updateImagePositionAndSize('heart', blobX + blobSize / 2 + 20, blobY - blobSize / 2);
    updateImagePositionAndSize('burger', blobX - blobSize / 2 - 50, blobY);
    updateImagePositionAndSize('beer', blobX - blobSize / 2 - 50, blobY + blobSize / 2 + 20);
    updateImagePositionAndSize('poop', blobX - blobSize / 2 - 50, blobY - blobSize / 2 - 50);
    updateImagePositionAndSize('lightbulb', blobX, blobY - blobSize / 2 - 70);
    updateImagePositionAndSize('anais', blobX + blobSize / 2 + 250, blobY + blobSize / 2 + 50);
    updateImagePositionAndSize('kebab', blobX + blobSize / 2 + 250, blobY + blobSize / 2 + 50);
    updateImagePositionAndSize('anne', blobX + blobSize / 2 + 250, blobY - blobSize / 2 - 100);
    updateImagePositionAndSize('helene', blobX + blobSize / 2 + 250, blobY - blobSize / 2 - 100);
    updateImagePositionAndSize('william', blobX - blobSize / 2 - 250, blobY + blobSize / 2 + 50);

    if (pinkBlob) {
        updatePinkBlobPosition(deltaTime);  // Update pink blob position
    }
}

// function to update the position and size of other images (like heart, burger, etc.)
function updateImagePositionAndSize(id, x, y) {
    const img = document.getElementById(id);  // find the image by its id
    if (img) {  // if the image exists
        gsap.to(img, {
            x: x,
            y: y,
            width: blobSize / 3 + "px",  // scale the image size relative to the blob size
            height: blobSize / 3 + "px",
            duration: 0.1,
            ease: "power3.out"
        });
    }
}

// function to randomly adjust the blob's size when it hits an edge
function adjustBlobSize() {
    const sizeChange = Math.random() < 0.5 ? -20 : 20;  // randomly decide whether to increase or decrease size
    blobSize = Math.max(minBlobSize, Math.min(maxBlobSize, blobSize + sizeChange));  // make sure it stays within the size limits
    blob.style.width = blobSize + "px";
    blob.style.height = blobSize + "px";
}

// function to start the animation loop
function animateBlob() {
    let lastTime = 0;  // track the time of the last frame

    function animate(time) {
        const deltaTime = (time - lastTime) / 1000;  // calculate time passed since last frame in seconds
        lastTime = time;  // update last time to current time
        updateBlobPosition(deltaTime);  // update blob's position, size, and rotation
        requestAnimationFrame(animate);  // request the next animation frame
    }

    requestAnimationFrame(animate);  // start the first animation frame
}

// call this to start animating the blob
animateBlob();
startAlternatingBlobImages();  // Start alternating blob images

// functions to display different images like heart, burger, etc.

// function to switch blob image to blushing blob and show a heart
function displayHeart() {
    blob.src = 'blushingblob.png';  // switch to blushing blob image

    let heart = document.getElementById('heart');  // find the heart image by id
    if (!heart) {  // if it doesn't exist, create it
        heart = document.createElement('img');
        heart.id = 'heart';
        heart.src = 'heart.png';
        heart.style.position = 'absolute';
        heart.style.zIndex = '1000';
        document.body.appendChild(heart);
    }
    heart.style.display = 'block';  // show the heart

    // revert to the original blob image and hide the heart after 5 seconds
    setTimeout(() => {
        blob.src = isBlobImageToggled ? alternateBlobImage : currentBlobImage;  // return to the alternating image
        heart.style.display = 'none';  // hide the heart
    }, 5000);
}

// function to display the pink blob and related effects
function displayPinkBlob() {
    if (!pinkBlob) {
        pinkBlob = document.createElement('img');
        pinkBlob.id = 'pinkBlob';
        pinkBlob.src = 'pinkblob.png';
        pinkBlob.style.position = 'absolute';
        pinkBlob.style.zIndex = '1000';
        document.body.appendChild(pinkBlob);
    }

    pinkBlobX = blobX + blobSize + 20;  // Position pinkBlob next to blob
    pinkBlobY = blobY;  // Align vertically with the main blob
    pinkBlob.style.width = blobSize + "px";  // Set pinkBlob size equal to blob size
    pinkBlob.style.height = blobSize + "px";

    pinkBlob.style.display = 'block';  // show the pink blob

    displayHeart();  // display heart and change blob to blushingblob

    // Hide the pink blob after 10 seconds
    setTimeout(() => {
        pinkBlob.style.display = 'none';
        pinkBlob = null;
    }, 10000);
}

// Create the command window
function createCommandWindow() {
    const commandWindow = document.createElement("div");
    commandWindow.id = "commandWindow";
    commandWindow.style.position = "fixed";
    commandWindow.style.bottom = "20px";
    commandWindow.style.right = "20px";
    commandWindow.style.width = "1000px";  // Doubled width for a larger window
    commandWindow.style.padding = "60px";  // Increased padding to match the larger size
    commandWindow.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    commandWindow.style.color = "white";
    commandWindow.style.borderRadius = "20px";
    commandWindow.style.boxShadow = "0 0 30px rgba(0, 0, 0, 0.5)";
    commandWindow.style.fontFamily = "Arial, sans-serif";
    commandWindow.style.fontSize = "56px";  // Larger font size for very readable text
    commandWindow.style.lineHeight = "2";  // Increased line height for comfortable spacing
    commandWindow.style.textAlign = "center";  // Center align all text
    commandWindow.style.opacity = 0;
    commandWindow.style.display = "none";
    commandWindow.style.zIndex = "10000";

    commandWindow.innerHTML = `
        <h4 style="margin-top: 0; font-size: 84px; text-align: center;">Blob Commands</h4>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
            <li><strong>⬆️:</strong> Move up</li>
            <li><strong>⬇️:</strong> Move down</li>
            <li><strong>⬅️:</strong> Move left</li>
            <li><strong>➡️:</strong> Move right</li>
            <li><strong>s:</strong> Slow down</li>
            <li><strong>z:</strong> Rotate right</li>
            <li><strong>w:</strong> Rotate left</li>
            <li><strong>Space:</strong> Stop/Start</li>
            <li><strong>x:</strong> Show ❤️</li>
            <li><strong>y:</strong> Show 🍔</li>
            <li><strong>q:</strong> Show 🍺</li>
            <li><strong>p:</strong> Show 💩</li>
            <li><strong>l:</strong> Show 💡</li>
            <li><strong>a:</strong> Show anais</li>
            <li><strong>k:</strong> Show 🥙</li>
            <li><strong>n:</strong> Show anne</li>
            <li><strong>h:</strong> Show helene</li>
            <li><strong>c:</strong> Show 😭</li>
            <li><strong>f:</strong> Show william</li>
            <li><strong>0:</strong> Show pink blob</li> <!-- Added command for pink blob -->
            <li><strong>?:</strong> Help window</li>
        </ul>
    `;

    document.body.appendChild(commandWindow);
}

// Function to toggle the command window
function toggleCommandWindow() {
    const commandWindow = document.getElementById("commandWindow");
    if (commandWindow.style.display === "none") {
        gsap.to(commandWindow, {
            duration: 0.5,
            x: 0,
            opacity: 1,
            display: "block",
            ease: "power3.out"
        });
    } else {
        gsap.to(commandWindow, {
            duration: 0.5,
            x: 300,
            opacity: 0,
            onComplete: function() {
                commandWindow.style.display = "none";
            },
            ease: "power3.in"
        });
    }
}

// Initialize the command window on page load
createCommandWindow();

// event listener for keydown events to control the blob
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowUp":
            isStopped = false;
            velocityY = velocityY < 0 ? velocityY - 100 : -300;  // move blob up faster
            break;
        case "ArrowDown":
            isStopped = false;
            velocityY = velocityY > 0 ? velocityY + 100 : 300;  // move blob down faster
            break;
        case "ArrowLeft":
            isStopped = false;
            velocityX = velocityX < 0 ? velocityX - 100 : -300;  // move blob left faster
            break;
        case "ArrowRight":
            isStopped = false;
            velocityX = velocityX > 0 ? velocityX + 100 : 300;  // move blob right faster
            break;
        case "f":
            displayWilliam();  // show william image
            break;
        case "s":
            speedMultiplier = Math.max(0.1, speedMultiplier - 0.3);  // slow down the blob
            break;
        case "z":
            isRotatingRight = !isRotatingRight;  // toggle right rotation
            if (isRotatingRight) isRotatingLeft = false;  // if rotating right, stop rotating left
            break;
        case "w":
            isRotatingLeft = !isRotatingLeft;  // toggle left rotation
            if (isRotatingLeft) isRotatingRight = false;  // if rotating left, stop rotating right
            break;
        case " ":
            isStopped = !isStopped;  // toggle stop/start
            if (isStopped) {
                velocityX = 0;
                velocityY = 0;
                isRotatingRight = false;
                isRotatingLeft = false;
                rotation = 0;
            } else {
                // resume with random direction
                velocityX = 300 * (Math.random() < 0.5 ? -1 : 1);
                velocityY = 300 * (Math.random() < 0.5 ? -1 : 1);
            }
            break;
        case "x":
            displayHeart();  // switch the image and show heart
            break;
        case "y":
            displayBurger();  // show the burger
            break;
        case "q":
            displayBeer();  // show the beer
            break;
        case "p":
            displayPoop();  // show the poop
            break;
        case "l":
            displayLightbulb();  // show the lightbulb
            break;
        case "a":
            displayAnais();  // show anais 
            break;
        case "k":
            displayKebab(); // show the kebab
            break;
        case "n":
            displayAnne(); // show anne
            break;
        case "h":
            displayHelene(); // show helene
            break;
        case "c":
            displayCryingBlob(); // show crying blob
            break;
        case "0":
            displayPinkBlob();  // Show the pink blob
            break;
        case "?":
            toggleCommandWindow();  // toggle the command window
            break;
    }
});

// event listener for mouse wheel events to change blob size
document.addEventListener("wheel", function(event) {
    blobSize += event.deltaY > 0 ? 5 : -5;  // make the blob bigger or smaller depending on scroll direction
    blobSize = Math.max(minBlobSize, Math.min(blobSize, maxBlobSize));  // keep blob size within allowed limits
    blob.style.width = blobSize + "px";
    blob.style.height = blobSize + "px";
    saveBlobState();  // Save the blob state after changing its size
});
