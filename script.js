// Initialize blob element and its properties
const blob = document.getElementById("blob");

let blobX = 0;
let blobY = 0;
let velocityX = 100;  // horizontal speed
let velocityY = 100;  // vertical speed
let speedMultiplier = 1;
let blobSize = 50; // initial size of the blob (small size for the popup)
const maxBlobSize = 1000; // maximum size for the popup
const minBlobSize = 100;  // minimum size for the popup
let isStopped = false;
let rotation = 0;
let isRotatingRight = false;
let isRotatingLeft = false;
let isVisible = false; // command window visibility
let heartElement = null;  // to track heart image

// Create the command window element dynamically
const commandsWindow = document.createElement('div');
commandsWindow.id = 'commands';
commandsWindow.style.position = 'fixed';
commandsWindow.style.bottom = '20px';
commandsWindow.style.right = '20px';
commandsWindow.style.width = '800px'; 
commandsWindow.style.height = '1500px'; 
commandsWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
commandsWindow.style.color = 'white';
commandsWindow.style.padding = '10px';
commandsWindow.style.borderRadius = '10px';
commandsWindow.style.fontSize = '3em'; 
commandsWindow.style.display = 'none'; 
commandsWindow.style.zIndex = '1000';
commandsWindow.style.fontFamily = 'Verdana, sans-serif';

// Add list of commands with emojis to the window
const commandList = `
  <ul style="list-style: none; padding: 0;">

    <li>Arrow Up: Move ⬆️ </li>
    <li>Arrow Down: Move ⬇️ </li>
    <li>Arrow Left: Move ⬅️ </li>
    <li>Arrow Right: Move ➡️ </li>
    <li>Space: ⏸️/▶️ </li>
    <li>f: Faster</li>
    <li>s: Slower</li>
    <li>z: Rotate Right</li>
    <li>w: Rotate Left</li>
    <li>x: Show ❤️</li>
    <li>?: Toggle Commands</li>
  </ul>
`;
commandsWindow.innerHTML = commandList;
document.body.appendChild(commandsWindow);

// Toggle the command window visibility using GSAP
function toggleCommands() {
  if (isVisible) {
    gsap.to(commandsWindow, {
      autoAlpha: 0,
      duration: 0.5,
      onComplete: () => {
        commandsWindow.style.display = 'none';
      }
    });
  } else {
    commandsWindow.style.display = 'block';
    gsap.to(commandsWindow, {
      autoAlpha: 1,
      duration: 0.5
    });
  }
  isVisible = !isVisible;
}

// Update blob position and handle animations
function updateBlobPosition(deltaTime) {
    const width = window.innerWidth - blob.offsetWidth;
    const height = window.innerHeight - blob.offsetHeight;

    if (!isStopped) {
        blobX += velocityX * speedMultiplier * deltaTime;
        blobY += velocityY * speedMultiplier * deltaTime;

        if (blobX <= 0 || blobX >= width) {
            velocityX *= -1;
            blobX = Math.max(0, Math.min(blobX, width));
            adjustBlobSize();
        }

        if (blobY <= 0 || blobY >= height) {
            velocityY *= -1;
            blobY = Math.max(0, Math.min(blobY, height));
            adjustBlobSize();
        }

        if (isRotatingRight) {
            rotation += 5;
        } else if (isRotatingLeft) {
            rotation -= 5;
        }
    }

    gsap.to(blob, {
        x: blobX,
        y: blobY,
        width: blobSize + "px",
        height: blobSize + "px",
        rotation: rotation,
        duration: 0.1,
        ease: "power3.out"
    });

    // Move heart above the blob, if it exists
    if (heartElement) {
        gsap.to(heartElement, {
            x: blobX + (blobSize / 4),  // Position heart centered above the blob
            y: blobY - (blobSize / 2) - 38,  // Position heart 10mm above blob (38px)
            width: blobSize / 2 + 'px',
            height: blobSize / 2 + 'px',
            duration: 0.1,
            ease: 'power3.out'
        });
    }
}

function adjustBlobSize() {
    const sizeChange = Math.random() < 0.5 ? -5 : 5;
    blobSize = Math.max(minBlobSize, Math.min(maxBlobSize, blobSize + sizeChange));
    blob.style.width = blobSize + "px";
    blob.style.height = blobSize + "px";
}

// Start the blob animation
function animateBlob() {
    let lastTime = 0;

    function animate(time) {
        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;
        updateBlobPosition(deltaTime);
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

animateBlob();

// Handle key press events for commands
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowUp":
            isStopped = false;
            velocityY = velocityY < 0 ? velocityY - 50 : -100;
            break;
        case "ArrowDown":
            isStopped = false;
            velocityY = velocityY > 0 ? velocityY + 50 : 100;
            break;
        case "ArrowLeft":
            isStopped = false;
            velocityX = velocityX < 0 ? velocityX - 50 : -100;
            break;
        case "ArrowRight":
            isStopped = false;
            velocityX = velocityX > 0 ? velocityX + 50 : 100;
            break;
        case "f":
            speedMultiplier += 0.1;
            break;
        case "s":
            speedMultiplier = Math.max(0.1, speedMultiplier - 0.1);
            break;
        case "z":
            isRotatingRight = !isRotatingRight;
            if (isRotatingRight) isRotatingLeft = false;
            break;
        case "w":
            isRotatingLeft = !isRotatingLeft;
            if (isRotatingLeft) isRotatingRight = false;
            break;
        case "x":
            showBlushingBlobAndHeart();
            break;
        case " ":
            isStopped = !isStopped;
            if (isStopped) {
                velocityX = 0;
                velocityY = 0;
                isRotatingRight = false;
                isRotatingLeft = false;
                rotation = 0;
            } else {
                velocityX = 100 * (Math.random() < 0.5 ? -1 : 1);
                velocityY = 100 * (Math.random() < 0.5 ? -1 : 1);
            }
            break;
        case "?":
            toggleCommands();  // Toggle the command window
            break;
    }
});

// Show blushing blob and heart on "x" press
function showBlushingBlobAndHeart() {
    // Change blob to blushing blob
    blob.src = 'blushingblob.png';  // Ensure this is the correct path

    // Create heart element if it doesn't exist
    if (!heartElement) {
        heartElement = document.createElement('img');
        heartElement.src = 'heart.png';  // Ensure this is the correct path
        heartElement.style.position = 'absolute';
        heartElement.style.zIndex = '999';  // Ensure heart is above blob
        document.body.appendChild(heartElement);
    }

    // Position heart above the blob
    gsap.to(heartElement, {
        x: blobX + (blobSize / 4),
        y: blobY - (blobSize / 2) - 38,
        width: blobSize / 2 + "px",
        height: blobSize / 2 + "px",
        duration: 0.1,
        ease: "power3.out"
    });

    // Revert to original blob after 10 seconds
    setTimeout(function () {
        blob.src = 'blob.png';  // Ensure this is the correct path
        if (heartElement) {
            heartElement.remove();  // Remove heart from DOM
            heartElement = null;
        }
    }, 10000);  // Revert after 10 seconds
}

// Example wheel event for resizing blob
document.addEventListener("wheel", function(event) {
    blobSize += event.deltaY > 0 ? 2 : -2;
    blobSize = Math.max(minBlobSize, Math.min(blobSize, maxBlobSize));
    blob.style.width = blobSize + "px";
    blob.style.height = blobSize + "px";

    if (heartElement) {
        heartElement.style.width = blobSize / 2 + "px";
        heartElement.style.height = blobSize / 2 + "px";
    }
});
