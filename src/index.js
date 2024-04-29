const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 756

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 45) {
  collisionsMap.push(collisions.slice(i, 45 + i));
}

const battleZonesMap = [];
for (let i = 0; i < battleZones.length; i += 45) {
  battleZonesMap.push(battleZones.slice(i, 45 + i));
}

const boundaries = []
const offset = {
  x: -1400,
  y: -500,
};


collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 606)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
        })
      );
  });
});

const generatorZones = []

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 612)
      generatorZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

console.log(generatorZones)
const image = new Image()
image.src = './assets/images/thevaultsmap.png'

const playerDownImage = new Image();
playerDownImage.src = './assets/images/spritesheetDown3.png';
const playerUpImage = new Image();
playerUpImage.src = './assets/images/spritesheetUp3.png';
const playerLeftImage = new Image();
playerLeftImage.src = './assets/images/spritesheetLeft3.png';
const playerRightImage = new Image();
playerRightImage.src = './assets/images/spritesheetRight3.png';

const foregroundImage = new Image();
foregroundImage.src = './assets/images/foregroundObjects.png';

const foregroundImageDark = new Image();
foregroundImageDark.src = './assets/images/foregroundObjectsDark.png';

const generatorImage = new Image();
generatorImage.src = './assets/images/generators.png';

const generatorSetup = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: generatorImage,
});

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 122 / 2,
    y: canvas.height / 2 - 105 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 2,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});
  console.log(player)
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const foregroundDark = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImageDark,
});

const keys = {
    w:  {
        pressed:false
    },
    a:  {
        pressed:false
    },
    s:  {
        pressed:false
    },
    d:  {
        pressed:false
    }
    
    
}

const movables = [background, ...boundaries, foreground, foregroundDark, ...generatorZones, generatorSetup]

function rectangularCollision({rectangle1, rectangle2}){
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

const generator = {
  intiaited: false
}


const generatorBackgroundImage = new Image();
generatorBackgroundImage.src = './assets/images/genBack.png';
const generatorBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: generatorBackgroundImage,
});


const generatorBackgroundImage1 = new Image();
generatorBackgroundImage1.src = './assets/images/genBack2.png';
const generatorBackground1 = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: generatorBackgroundImage1,
}); 

const generatorBackgroundImage2 = new Image();
generatorBackgroundImage2.src = './assets/images/genPush.png';
const generatorBackground2 = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: generatorBackgroundImage2,
}); 
function animateTitleScreen() {
  const animationTitleId = window.requestAnimationFrame(animateTitleScreen);

  generatorBackground.draw();
  c.fillStyle = 'rgb(164,158,150)'; // Color of the text
  c.fillRect(100, 200, 800, 400);

  // Set font properties
  c.font = 'bold 21px monospace';
  c.fillStyle = 'white'; // Color of the text
  c.textAlign = 'center';
  // Add text to the canvas
  c.fillText('Welcome to the Vaults.', 500, 250);
  c.fillText('We are having issues with our power source.', 500, 300);
  c.fillText('Something or someone keeps knocking out the lights.', 500, 350);
  c.fillText(
    'Without the power the crime rate is at an all time high.',
    500,
    400
  );
  c.fillText('Also. The door is locked shut…', 500, 450);
  c.fillText('We are trapped!', 500, 500);
  c.fillText('Please can you help us restore the power. ', 500, 550);

  // Call drawButton function with parameters
  drawButton('Start', 450, 650, 100, 30);

  // Add event listener for mouse click
  canvas.addEventListener('click', handleStartClick);

}

function handleStartClick(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  // Check if the click is within the button area
  if (mouseX > 450 && mouseX < 450 + 100 && mouseY > 650 && mouseY < 650 + 30) {
    // Handle button click action here
    console.log('Start button clicked!');
    animate()
     window.cancelAnimationFrame(animationTitleId);
  }
}

function drawButton(text, x, y, width, height) {
  // Draw button background
  c.fillStyle = '#6E6861'; // blue color
  c.fillRect(x, y, width, height);

  // Draw button text
  c.fillStyle = '#fff'; // white color
  c.font = 'Bold 20px Arial';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(text, x + width / 2, y + height / 2);
}

//animateTitleScreen()

var generatorsCollected = 0
var totalGenerators = 3

function animate() {
  const animationId = window.requestAnimationFrame(animate);

  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  generatorZones.forEach((generatorZone) => {
    generatorZone.draw();
  });

  // Draw the black background with more transparency
  c.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Semi-transparent black
  c.fillRect(0, 0, canvas.width, canvas.height);
generatorSetup.draw();
  // Draw the text
  c.font = 'bold 21px monospace';
  c.fillStyle = 'yellow';
  c.fillText(
    generatorsCollected + '/' + totalGenerators + ' Generators',
    125,
    20
  );

  // Draw the foreground
  foreground.draw();

  // Draw the ring of light around the character
  const gradient = c.createRadialGradient(
    player.position.x + player.width / 2,
    player.position.y + player.height / 2,
    120, // Inner radius
    player.position.x + player.width / 2,
    player.position.y + player.height / 2,
    180 // Outer radius
  );
  gradient.addColorStop(0, 'rgba(255, 223, 176, 0.2)'); // Start color
  gradient.addColorStop(1, 'transparent'); // End color

  c.beginPath();
  c.arc(
    player.position.x + player.width / 2,
    player.position.y + player.height / 2,
    140,
    0,
    Math.PI * 2
  );
  c.fillStyle = gradient;
  c.fill(); // Fill the circle with the radial gradient
  c.closePath();
  // Draw the player sprite
  player.draw();

  // Draw the foreground
  foregroundDark.draw();

  let moving = true;
  player.moving = false;
  if (generatorZones.intiaited) return;

  // Add an 'available' property to each generator zone
  generatorZones.forEach((generatorZone) => {
    generatorZone.available = true; // Set all zones as available initially
  });

  // Inside the loop that checks for overlapping with generator zones
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < generatorZones.length; i++) {
      const generatorZone = generatorZones[i];
      // Check if the generator zone is available
      if (generatorZone.available) {
        const overlappingArea =
          (Math.min(
            player.position.x + player.width,
            generatorZone.position.x + generatorZone.width
          ) -
            Math.max(player.position.x, generatorZone.position.x)) *
          (Math.min(
            player.position.y + player.height,
            generatorZone.position.y + generatorZone.height
          ) -
            Math.max(player.position.y, generatorZone.position.y));

        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: generatorZone,
          }) &&
          overlappingArea > (player.width * player.height) / 2 &&
          Math.random() < 0.1
        ) {
          console.log('battle collis');

          // Deactivate the current generator zone
          generatorZone.available = false;
          //deactivate current animation loop
          window.cancelAnimationFrame(animationId);
          generatorZone.intiaited = true;
          gsap.to('#overlappingDiv', {
            opacity: 1,
            repeat: 3,
            yoyo: true,
            duration: 0.4,
            onComplete() {
              gsap.to('#overlappingDiv', {
                opacity: 1,
                duration: 0.4,
                onComplete() {
                  // activate a new animation loop
                  animateGeneratorRandom();
                  gsap.to('#overlappingDiv', {
                    opacity: 0,
                    duration: 0.4,
                  });
                },
              });
            },
          });
          break;
        }
      }
    }
  }

  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true;
    player.image = player.sprites.up;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        console.log('colliding');
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey === 's') {
    player.moving = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  }
}


//animate();

function collectGenerator() {
  generatorsCollected++;

  // Check if all generators have been collected
  if (generatorsCollected === totalGenerators) {
    // Game over or other action

  }
}



const numRows = 3;
const numCols = 3;
const buttonRadius = 30;
const gap = 20;
const startX =
  canvas.width / 2 - ((numCols - 1) * (2 * buttonRadius + gap)) / 2;
const startY =
  canvas.height / 2 - ((numRows - 1) * (2 * buttonRadius + gap)) / 2;

const buttons = [];

for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    const x = startX + col * (2 * buttonRadius + gap);
    const y = startY + row * (2 * buttonRadius + gap);
    const color = getRandomColor();
    buttons.push(new Button(x, y, buttonRadius, color, changeButtonColor));
  }
}


function getRandomColor() {
  const colors = ['red', 'yellow', 'blue', 'green'];
  return colors[Math.floor(Math.random() * colors.length)];
}

let gameCompleted = false;

function changeButtonColor(button) {
  if (!gameCompleted && button.currentColor !== 'green') {
    button.currentColor = getRandomColor();
    checkCompletion();
  }
}


function checkCompletion() {
  let allGreen = true;
  buttons.forEach((button) => {
    if (button.currentColor !== 'green') {
      allGreen = false;
      return;
    }
  });
  if (allGreen) {
    console.log('game complete')
    collectGenerator()
    animate()
  }
}


canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  buttons.forEach((button) => {
    button.handleClick(mouseX, mouseY);
  });
});


function animateGenerator() {
  window.requestAnimationFrame(animateGenerator);
 // console.log('new Gen');
  generatorBackground1.draw();
  // Draw buttons
  buttons.forEach((button) => {
    button.draw();
  });
}




const progressBarWidth = 300;
const progressBarHeight = 30;
const progressBarX = (canvas.width - progressBarWidth) / 2;
const progressBarY = (canvas.height - progressBarHeight) / 2;

let progress = 0;
let isButtonHeld = false; // Track whether the button is being held down
let holdInterval; // Variable to store the setInterval reference

// Add event listeners for mouse down and mouse up
canvas.addEventListener('mousedown', startIncrement);
canvas.addEventListener('mouseup', stopIncrement);


function animateGenerator2() {
  const animationGen2Id = window.requestAnimationFrame(animateGenerator2);
  generatorBackground2.draw();

  // Draw progress bar outline
  c.fillStyle = 'lightgray';
  c.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

  // Draw filled progress bar
  c.fillStyle = 'green';
  c.fillRect(
    progressBarX,
    progressBarY,
    progress * progressBarWidth,
    progressBarHeight
  );

  // Call drawButton function with parameters
  drawButton('Push', 450, 650, 100, 30);
}

function startIncrement(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  // Check if the mouse down event is within the button area
  if (mouseX > 450 && mouseX < 450 + 100 && mouseY > 650 && mouseY < 650 + 30) {
    isButtonHeld = true;
    holdInterval = setInterval(incrementProgress, 1000); // Increment progress every second
  }
}


function stopIncrement() {
  isButtonHeld = false;
  clearInterval(holdInterval); // Stop the interval when the button is released
}

function incrementProgress() {
  if (progress < 1) {
    progress += 0.1; // Increase progress by 10% per second
  }

  // Check if progress is full
  if (progress >= 1) {
    console.log('game complete');
    collectGenerator();
    animate();
     window.cancelAnimationFrame(animationGen2Id);
  }
}
function animateGenerator3() {
  const animationGen3Id = window.requestAnimationFrame(animateGenerator3);
  generatorBackground.draw();

  

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let clickedNumbers = [];

  // Draw buttons
  function drawButtons() {
    
    c.font = 'bold 100px Arial';
    c.fillStyle = 'blue';
    numbers.forEach((num, index) => {
      const x = 90 + index * 90;
      const y = 350;
      c.fillText(num, x, y);
    });
  }

  // Check if clicked numbers form the winning combination
  function checkWin() {
    const winningCombination = [3, 7, 8];
    const clickedSet = new Set(clickedNumbers);
    if (winningCombination.every((num) => clickedSet.has(num))) {
      console.log('Congratulations! You Win 3!');
      if(generatorsCollected > 3){
      collectGenerator()
      }
      animate()
    }
  }

  // Handle click event
  canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    numbers.forEach((num, index) => {
      const buttonX = 90 + index * 90;
      const buttonY = 350;
      if (
        x >= buttonX &&
        x <= buttonX + 50 && // Adjusted width to cover the button
        y >= buttonY - 50 && // Adjusted height to cover the button
        y <= buttonY
      ) {
        clickedNumbers.push(num);
        console.log('button pressed')
        checkWin();
      }
    });
  });

 c.font = ' 38px Monospace';
 c.fillStyle = 'white';
c.fillText('Select the correct number combination:', 500, 100)
  // Draw buttons initially
  drawButtons();
}




const generatorZonesVal = [
  {
    zone: new Boundary({
      position: { x: -984 , y: -84 },
    }),
    animationFunction: animateGenerator,
    completed: false
  },
  {
    zone: new Boundary({
      position: { x: 2032, y: 1372 },
    }),
    animationFunction: animateGenerator2,
    completed: false
  },
  {
    zone: new Boundary({
      position: { x: 160, y: 2724},
    }),
    animationFunction: animateGenerator3,
    completed: false
  },
  // Add more generator zones as needed
];

let currentGeneratorIndex = 0;


function animateGeneratorRandom() {
  if (currentGeneratorIndex < generatorZonesVal.length) {
    const selectedZone = generatorZonesVal[currentGeneratorIndex];
    if (!selectedZone.completed) {
      selectedZone.animationFunction();
      selectedZone.completed = true; // Mark animation as completed
      currentGeneratorIndex++;
    }
}
}

function winScreen() {

}


animateTitleScreen()

//animateGenerator3();

//animateGenerator2()

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's': 
             keys.s.pressed = true
             lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
});


