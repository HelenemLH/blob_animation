const blob = document.getElementById("blob");

let blobX = 0;  
let blobY = 0;  
let velocityX = 600;  // horizontal speed
let velocityY = 600;  // vertical speed
let speedMultiplier = 1;
let blobSize = 600; // initial size of the blob
const maxBlobSize = 3100; // maximum size
const minBlobSize = 50;  // minimum size
let isStopped = false;
let rotation = 0;
let isRotatingRight = false;
let isRotatingLeft = false;

function updateBlobPosition(deltaTime) {
    const width = window.innerWidth - blob.offsetWidth;
    const height = window.innerHeight - blob.offsetHeight;

    if (!isStopped) {
        blobX += velocityX * speedMultiplier * deltaTime;
        blobY += velocityY * speedMultiplier * deltaTime;

        // check if the blob hits the left or right edge
        if (blobX <= 0 || blobX >= width) {
            velocityX *= -1; // reverse horizontal direction
            blobX = Math.max(0, Math.min(blobX, width)); // ensure the blob stays within bounds
            adjustBlobSize(); // change the size of the blob when it bounces
        }

        // check if the blob hits the top or bottom edge
        if (blobY <= 0 || blobY >= height) {
            velocityY *= -1; // reverse vertical direction
            blobY = Math.max(0, Math.min(blobY, height)); // ensure the blob stays within bounds
            adjustBlobSize(); // change the size of the blob when it bounces
        }

        // handle rotation
        if (isRotatingRight) {
            rotation += 5;
        } else if (isRotatingLeft) {
            rotation -= 5;
        }
    }

    // apply the new position and rotation using gsap for smooth animation
    gsap.to(blob, {
        x: blobX,
        y: blobY,
        width: blobSize + "px",
        height: blobSize + "px",
        rotation: rotation,
        duration: 0.1,
        ease: "power3.out"
    });

    // update the position of the heart if it exists
    const heart = document.getElementById('heart');
    if (heart) {
        gsap.to(heart, {
            x: blobX + blobSize / 2 + 20, // position it to the right of the blob
            y: blobY - blobSize / 2, // align it with the top of the blob
            width: blobSize / 3 + "px", // scale the heart size with the blob
            height: blobSize / 3 + "px",
            duration: 0.1,
            ease: "power3.out"
        });
    }

    // update the position of the burger if it exists
    const burger = document.getElementById('burger');
    if (burger) {
        gsap.to(burger, {
            x: blobX - blobSize / 2 - 50, // position it to the left of the blob
            y: blobY, // align it with the blob vertically
            width: blobSize / 3 + "px", // scale the burger size with the blob
            height: blobSize / 3 + "px",
            duration: 0.1,
            ease: "power3.out"
        });
    }

    // update the position of the beer if it exists
    const beer = document.getElementById('beer');
    if (beer) {
        gsap.to(beer, {
            x: blobX - blobSize / 2 - 50, // position it to the left of the blob
            y: blobY + blobSize / 2 + 20, // position it below the blob
            width: blobSize / 3 + "px", // scale the beer size with the blob
            height: blobSize / 3 + "px",
            duration: 0.1,
            ease: "power3.out"
        });
    }

    // update the position of the poop if it exists
    const poop = document.getElementById('poop');
    if (poop) {
        gsap.to(poop, {
            x: blobX - blobSize / 2 - 50, // position it to the left of the blob
            y: blobY - blobSize / 2 - 50, // position it above the blob
            width: blobSize / 3 + "px", // scale the poop size with the blob
            height: blobSize / 3 + "px",
            duration: 0.1,
            ease: "power3.out"
        });
    }

    // update the position of the lightbulb if it exists
    const lightbulb = document.getElementById('lightbulb');
    if (lightbulb) {
        gsap.to(lightbulb, {
            x: blobX, // position it directly above the blob
            y: blobY - blobSize / 2 - 70, // position it above the blob
            width: blobSize / 3 + "px", // scale the lightbulb size with the blob
            height: blobSize / 3 + "px",
            duration: 0.1,
            ease: "power3.out"
        });
    }

    // update the position of the anais image if it exists
    const anais = document.getElementById('anais');
    if (anais) {
        gsap.to(anais, {
            x: blobX + blobSize / 2 + 250, // position it to the right of the blob
            y: blobY + blobSize / 2 + 50, // position it below the blob
            width: blobSize / 2 + "px", // scale the anais size with the blob
            height: blobSize / 2 + "px",
            duration: 0.1,
            ease: "power3.out"
        });
    }

    // update the position of the kebab if it exists
    const kebab = document.getElementById('kebab');
    if (kebab) {
        gsap.to(kebab, {
            x: blobX + blobSize / 2 + 250, // position it to the right of the blob
            y: blobY + blobSize / 2 + 50, // position it below the blob
            width: blobSize / 3 + "px", // scale the kebab size with the blob
            height: blobSize / 3 + "px",
            duration: 0.1,
            ease: "power3.out"
        });
    }
}

function adjustBlobSize() {
    const sizeChange = Math.random() < 0.5 ? -20 : 20;
    blobSize = Math.max(minBlobSize, Math.min(maxBlobSize, blobSize + sizeChange));
    blob.style.width = blobSize + "px";
    blob.style.height = blobSize + "px";
}

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

// function to switch to blushing blob and show heart
function displayHeart() {
    // switch the blob image to blushingblob.png
    blob.src = 'blushingblob.png';

    // create the heart image if it doesn't exist
    let heart = document.getElementById('heart');
    if (!heart) {
        heart = document.createElement('img');
        heart.id = 'heart';
        heart.src = 'heart.png';
        heart.style.position = 'absolute';
        heart.style.zIndex = '1000';
        document.body.appendChild(heart);
    }
    heart.style.display = 'block';  // show the heart

    // revert back to the original blob image and hide the heart after 5 seconds
    setTimeout(() => {
        blob.src = 'blob.png';  // revert to the original image
        heart.style.display = 'none';
    }, 5000);
}

// function to display the burger
function displayBurger() {
    // create the burger image if it doesn't exist
    let burger = document.getElementById('burger');
    if (!burger) {
        burger = document.createElement('img');
        burger.id = 'burger';
        burger.src = 'burger.png';
        burger.style.position = 'absolute';
        burger.style.zIndex = '1000';
        document.body.appendChild(burger);
    }
    burger.style.display = 'block';  // show the burger

    // hide the burger after 5 seconds
    setTimeout(() => {
        burger.style.display = 'none';
    }, 5000);
}

// function to display the beer
function displayBeer() {
    // create the beer image if it doesn't exist
    let beer = document.getElementById('beer');
    if (!beer) {
        beer = document.createElement('img');
        beer.id = 'beer';
        beer.src = 'beer.png';
        beer.style.position = 'absolute';
        beer.style.zIndex = '1000';
        document.body.appendChild(beer);
    }
    beer.style.display = 'block';  // show the beer

    // hide the beer after 5 seconds
    setTimeout(() => {
        beer.style.display = 'none';
    }, 5000);
}

// function to display the poop
function displayPoop() {
    // create the poop image if it doesn't exist
    let poop = document.getElementById('poop');
    if (!poop) {
        poop = document.createElement('img');
        poop.id = 'poop';
        poop.src = 'poop.png';
        poop.style.position = 'absolute';
        poop.style.zIndex = '1000';
        document.body.appendChild(poop);
    }
    poop.style.display = 'block';  // show the poop

    // hide the poop after 5 seconds
    setTimeout(() => {
        poop.style.display = 'none';
    }, 5000);
}

// function to display the lightbulb
function displayLightbulb() {
    // create the lightbulb image if it doesn't exist
    let lightbulb = document.getElementById('lightbulb');
    if (!lightbulb) {
        lightbulb = document.createElement('img');
        lightbulb.id = 'lightbulb';
        lightbulb.src = 'lightbulb.png';
        lightbulb.style.position = 'absolute';
        lightbulb.style.zIndex = '1000';
        document.body.appendChild(lightbulb);
    }
    lightbulb.style.display = 'block';  // show the lightbulb

    // hide the lightbulb after 5 seconds
    setTimeout(() => {
        lightbulb.style.display = 'none';
    }, 5000);
}

// function to display the anais image
function displayAnais() {
    // create the anais image if it doesn't exist
    let anais = document.getElementById('anais');
    if (!anais) {
        anais = document.createElement('img');
        anais.id = 'anais';
        anais.src = 'anais.png';
        anais.style.position = 'absolute';
        anais.style.zIndex = '1000';
        document.body.appendChild(anais);
    }
    anais.style.display = 'block';  // show the anais image

    // hide the anais image after 5 seconds
    setTimeout(() => {
        anais.style.display = 'none';
    }, 5000);
}

// function to display the kebab
function displayKebab() {
    // create the kebab image if it doesn't exist
    let kebab = document.getElementById('kebab');
    if (!kebab) {
        kebab = document.createElement('img');
        kebab.id = 'kebab';
        kebab.src = 'kebab.png';
        kebab.style.position = 'absolute';
        kebab.style.zIndex = '1000';
        document.body.appendChild(kebab);
    }
    kebab.style.display = 'block';  // show the kebab image

    // hide the kebab image after 5 seconds
    setTimeout(() => {
        kebab.style.display = 'none';
    }, 5000);
}

document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowUp":
            isStopped = false;
            velocityY = velocityY < 0 ? velocityY - 100 : -300;
            break;
        case "ArrowDown":
            isStopped = false;
            velocityY = velocityY > 0 ? velocityY + 100 : 300;
            break;
        case "ArrowLeft":
            isStopped = false;
            velocityX = velocityX < 0 ? velocityX - 100 : -300;
            break;
        case "ArrowRight":
            isStopped = false;
            velocityX = velocityX > 0 ? velocityX + 100 : 300;
            break;
        case "f":
            speedMultiplier += 0.1;
            break;
        case "s":
            speedMultiplier = Math.max(0.1, speedMultiplier - 0.3);
            break;
        case "z":
            isRotatingRight = !isRotatingRight;
            if (isRotatingRight) isRotatingLeft = false;
            break;
        case "w":
            isRotatingLeft = !isRotatingLeft;
            if (isRotatingLeft) isRotatingRight = false;
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
    }
});

document.addEventListener("wheel", function(event) {
    blobSize += event.deltaY > 0 ? 5 : -5;
    blobSize = Math.max(minBlobSize, Math.min(blobSize, maxBlobSize));
    blob.style.width = blobSize + "px";
    blob.style.height = blobSize + "px";
});
