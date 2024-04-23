

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1550
canvas.height = 820

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 45) {
  collisionsMap.push(collisions.slice(i, 45 + i));
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
console.log(boundaries)

const image = new Image()
image.src = './assets/images/thevaultsmap.png'

const playerDownImage = new Image();
playerDownImage.src = './assets/images/spritesheetDown.png';
const playerUpImage = new Image();
playerUpImage.src = './assets/images/spritesheetUp.png';
const playerLeftImage = new Image();
playerLeftImage.src = './assets/images/spritesheetLeft1.png';
const playerRightImage = new Image();
playerRightImage.src = './assets/images/spritesheetRight1.png';

const foregroundImage = new Image();
foregroundImage.src = './assets/images/foregroundObjects.png';

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 158 / 2,
    y: canvas.height / 2 - 100 / 2,
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

const movables = [background, ...boundaries, foreground]

function rectangularCollision({rectangle1, rectangle2}){
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function animate() {
  window.requestAnimationFrame(animate);

  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  // Draw the black background with more transparency
  c.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Semi-transparent black
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the foreground
  foreground.draw();

  // Draw the ring of light around the character
  c.beginPath();
  c.arc(
    player.position.x + player.width / 2,
    player.position.y + player.height / 2,
    80,
    0,
    Math.PI * 2
  );
  c.fillStyle = 'rgba(255, 255, 157, 0.3)'; // Semi-transparent bright yellow
  c.fill(); // Fill the circle with the specified color
  c.closePath();

  // Draw the player sprite
  player.draw();

  // Draw the foreground
  foreground.draw();

  let moving = true;
  player.moving = false;
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
animate()
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


