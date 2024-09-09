document.addEventListener('DOMContentLoaded', function () {
    const blob = document.getElementById('blob');

    let blobX = 0;
    let blobY = 0;
    let velocityX = 100;  // horizontal speed
    let velocityY = 100;  // vertical speed
    let speedMultiplier = 1;
    let blobSize = 50;  // initial size of the blob
    const maxBlobSize = 150;  // max blob size
    const minBlobSize = 30;  // min blob size
    let isStopped = false;
    let rotation = 0;
    let isRotatingRight = false;
    let isRotatingLeft = false;
    let isVisible = false;  // command window visibility
    let heartElement = null; // for the heart image

    // Create the command window element dynamically
    const commandsWindow = document.createElement('div');
    commandsWindow.id = 'commands';
    commandsWindow.style.position = 'fixed';
    commandsWindow.style.bottom = '20px';
    commandsWindow.style.right = '20px';
    commandsWindow.style.width = '300px';
    commandsWindow.style.height = '300px';
    commandsWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    commandsWindow.style.color = 'white';
    commandsWindow.style.padding = '10px';
    commandsWindow.style.borderRadius = '10px';
    commandsWindow.style.fontSize = '1em';
    commandsWindow.style.display = 'none';
    commandsWindow.style.zIndex = '1000';
    commandsWindow.style.fontFamily = 'Verdana, sans-serif';

    // Add list of commands to the window
    const commandList = `
        <ul style="list-style: none; padding: 0;">
            <li>Arrow Up: ⬆️ Move Up</li>
            <li>Arrow Down: ⬇️ Move Down</li>
            <li>Arrow Left: ⬅️ Move Left</li>
            <li>Arrow Right: ➡️ Move Right</li>
            <li>Space: ⏸️ Start/Stop</li>
            <li>f: Faster</li>
            <li>s: Slower</li>
            <li>z: Rotate Right</li>
            <li>w: Rotate Left</li>
            <li>x: Show Blushing Blob & ❤️</li>
            <li>?: Toggle Commands</li>
        </ul>
    `;
    commandsWindow.innerHTML = commandList;
    document.body.appendChild(commandsWindow);

    // Toggle the command window visibility
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
        const containerWidth = 300 - blob.offsetWidth;
        const containerHeight = 400 - blob.offsetHeight;

        if (!isStopped) {
            blobX += velocityX * speedMultiplier * deltaTime;
            blobY += velocityY * speedMultiplier * deltaTime;

            if (blobX <= 0 || blobX >= containerWidth) {
                velocityX *= -1;
                blobX = Math.max(0, Math.min(blobX, containerWidth));
            }

            if (blobY <= 0 || blobY >= containerHeight) {
                velocityY *= -1;
                blobY = Math.max(0, Math.min(blobY, containerHeight));
            }

            if (isRotatingRight) {
                rotation += 5;
            } else if (isRotatingLeft) {
                rotation -= 5;
            }
        }

        // Apply updated position and size to the blob using GSAP
        gsap.to(blob, {
            x: blobX,
            y: blobY,
            width: blobSize + 'px',
            height: blobSize + 'px',
            rotation: rotation,
            duration: 0.1,
            ease: 'power3.out'
        });

        // If the heart exists, keep it moving with the blob, 38 pixels above the blob
        if (heartElement) {
            gsap.to(heartElement, {
                x: blobX + (blobSize / 4),  // Center heart horizontally
                y: blobY - (blobSize / 2) - 38,  // Position heart exactly 10mm (38 pixels) above the blob
                width: blobSize / 2 + 'px',  // Adjust heart size proportionally
                height: blobSize / 2 + 'px',
                duration: 0.1,
                ease: 'power3.out'
            });
        }
    }

    // Animation loop for blob movement
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

    animateBlob();  // Start the blob animation

    // Handle key press events for commands
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowUp':
                isStopped = false;
                velocityY = velocityY < 0 ? velocityY - 50 : -100;
                break;
            case 'ArrowDown':
                isStopped = false;
                velocityY = velocityY > 0 ? velocityY + 50 : 100;
                break;
            case 'ArrowLeft':
                isStopped = false;
                velocityX = velocityX < 0 ? velocityX - 50 : -100;
                break;
            case 'ArrowRight':
                isStopped = false;
                velocityX = velocityX > 0 ? velocityX + 50 : 100;
                break;
            case 'f':
                speedMultiplier += 0.1;
                break;
            case 's':
                speedMultiplier = Math.max(0.1, speedMultiplier - 0.1);
                break;
            case 'z':
                isRotatingRight = !isRotatingRight;
                if (isRotatingRight) isRotatingLeft = false;
                break;
            case 'w':
                isRotatingLeft = !isRotatingLeft;
                if (isRotatingLeft) isRotatingRight = false;
                break;
            case 'x':
                showBlushingBlobAndHeart();
                break;
            case ' ':
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
            case '?':
                toggleCommands();  // Toggle the command window
                break;
        }
    });

    // Function to show blushing blob and heart
    function showBlushingBlobAndHeart() {
        // Change blob to blushing blob
        blob.src = 'blushingblob.png';

        // Create the heart element if it doesn't exist
        if (!heartElement) {
            heartElement = document.createElement('img');
            heartElement.src = 'heart.png';
            heartElement.style.position = 'absolute';
            heartElement.style.zIndex = '999';  // Make sure heart is above the blob
            document.body.appendChild(heartElement);
        }

        // Set heart near the blob and make it grow
        gsap.to(heartElement, {
            x: blobX + (blobSize / 4),  // Place heart centered above the blob
            y: blobY - (blobSize / 2) - 10,  
            width: blobSize / 2 + 'px',
            height: blobSize / 2 + 'px',
            duration: 0.1,
            ease: 'power3.out'
        });

    }

    // Example wheel event for resizing blob and heart together
    document.addEventListener('wheel', function (event) {
        blobSize += event.deltaY > 0 ? 2 : -2;
        blobSize = Math.max(minBlobSize, Math.min(blobSize, maxBlobSize));
        blob.style.width = blobSize + 'px';
        blob.style.height = blobSize + 'px';

        // Resize the heart with the blob
        if (heartElement) {
            heartElement.style.width = (blobSize / 2) + 'px';
            heartElement.style.height = (blobSize / 2) + 'px';
        }
    });
});
