class Boundary {
  static width = 104;
  static height = 104;
  constructor({ position }) {
    this.position = position;
    this.width = 104;
    this.height = 104;
  }
  draw() {
    c.fillStyle = 'rgba(255,0,0,0)';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Sprite {
  constructor({ position, image, frames = { max: 1 }, sprites }) {
    this.position = position;
    this.image = image;
    this.frames = {...frames, val: 0, elapsed: 0};

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height
    
    }
    this.moving = false
    this.sprites = sprites
  }

  draw() {
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    )
    if(!this.moving) return 
    if(this.frames.max > 1) {
        this.frames.elapsed++
    }

    if(this.frames.elapsed % 10 === 0) {
    if(this.frames.val < this.frames.max - 1)
    this.frames.val++
else this.frames.val = 0
  }
}
}

class Button {
  constructor(x, y, radius, color, onClick) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.defaultColor = color;
    this.currentColor = color;
    this.onClick = onClick;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.currentColor;
    c.fill();
    c.closePath();
  }

  handleClick(mouseX, mouseY) {
    const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
    if (distance <= this.radius) {
      this.onClick(this);
    }
  }
}

