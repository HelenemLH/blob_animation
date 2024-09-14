const blob = document.getElementById("blob");

let blobX = 0;
let blobY = 0;
let velocityX = 100;
let velocityY = 100;
let speedMultiplier = 1;
let blobSize = 50;
const maxBlobSize = 1000;
const minBlobSize = 100;
let isStopped = false;
let rotation = 0;
let isRotatingRight = false;
let isRotatingLeft = false;
let isVisible = false;
let heartElement = null;
let isRotatingForBeer = false;
let beerRotationTimeout = null;

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

    if (isRotatingRight || isRotatingForBeer) {
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

  if (heartElement) {
    gsap.to(heartElement, {
      x: blobX + (blobSize / 4),
      y: blobY - (blobSize / 2) - 38,
      width: blobSize / 2 + 'px',
      height: blobSize / 2 + 'px',
      duration: 0.1,
      ease: 'power3.out'
    });
  }

  checkForCatch();
}

function adjustBlobSize() {
  const sizeChange = Math.random() < 0.5 ? -5 : 5;
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
      toggleCommands();
      break;
  }
});

function showBlushingBlobAndHeart() {
  blob.src = 'blushingblob.png';

  if (!heartElement) {
    heartElement = document.createElement('img');
    heartElement.src = 'heart.png';
    heartElement.style.position = 'absolute';
    heartElement.style.zIndex = '999';
    document.body.appendChild(heartElement);
  }

  gsap.to(heartElement, {
    x: blobX + (blobSize / 4),
    y: blobY - (blobSize / 2) - 38,
    width: blobSize / 2 + "px",
    height: blobSize / 2 + "px",
    duration: 0.1,
    ease: "power3.out"
  });

  setTimeout(function () {
    blob.src = 'blob.png';
    if (heartElement) {
      heartElement.remove();
      heartElement = null;
    }
  }, 10000);
}

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

function showRandomImages() {
  const images = ['burger.png', 'beer.png', 'kebab.png', 'fire.png']; // Added fire.png here
  const randomImage = images[Math.floor(Math.random() * images.length)];

  const imgElement = document.createElement('img');
  imgElement.src = randomImage;
  imgElement.className = 'catchable';
  imgElement.style.position = 'absolute';
  imgElement.style.zIndex = '999';
  imgElement.style.width = '100px';

  const randomX = Math.random() * (window.innerWidth - 100);
  const randomY = Math.random() * (window.innerHeight - 100);

  imgElement.style.left = `${randomX}px`;
  imgElement.style.top = `${randomY}px`;

  document.body.appendChild(imgElement);

  gsap.to(imgElement, {
    autoAlpha: 1,
    scale: 1.5,
    duration: 1,
    ease: 'power3.out',
  });

  setTimeout(() => {
    gsap.to(imgElement, {
      autoAlpha: 0,
      duration: 1,
      onComplete: () => {
        imgElement.remove();
      }
    });
  }, 5000);
}

function checkForCatch() {
  const blobRect = blob.getBoundingClientRect();
  const catchables = document.querySelectorAll('.catchable');

  catchables.forEach(catchable => {
    const catchableRect = catchable.getBoundingClientRect();
    const overlap = !(blobRect.right < catchableRect.left || 
                      blobRect.left > catchableRect.right || 
                      blobRect.bottom < catchableRect.top || 
                      blobRect.top > catchableRect.bottom);

    if (overlap) {
      if (catchable.src.includes('beer.png')) {
        if (!isRotatingForBeer) {
          isRotatingForBeer = true;
          gsap.to(blob, { rotation: '+=360', duration: 2, repeat: -1, ease: "none" });

          clearTimeout(beerRotationTimeout);
          beerRotationTimeout = setTimeout(() => {
            isRotatingForBeer = false;
            gsap.killTweensOf(blob, { rotation: true });
          }, 10000);
        }
      } else if (catchable.src.includes('fire.png')) { 
        if (!isRotatingForBeer) {
          isRotatingForBeer = true;
          gsap.to(blob, { rotation: '+=360', duration: 2, repeat: -1, ease: "none" });

          clearTimeout(beerRotationTimeout);
          beerRotationTimeout = setTimeout(() => {
            isRotatingForBeer = false;
            gsap.killTweensOf(blob, { rotation: true });
          }, 10000);
        }
      }
      catchable.remove();
      blobSize = Math.min(maxBlobSize, blobSize + 20);
    }
  });
}

setInterval(showRandomImages, 3000);
