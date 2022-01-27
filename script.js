// Name any p5.js functions we use in `global` so Glitch can recognize them.
/* global
 *    background, createCanvas, ellipse, noFill, stroke, strokeWeight, rect, height, fill, keyCode, UP_ARROW, frameCount, random, width,
 collideCircleCircle, colorMode, HSB, text, textSize, textAlign, noLoop, CENTER, loadImage, image
 */
let bird, pipes, gameIsOver, score, coins, lives, img;



function setup(){
  createCanvas(400, 600);
  colorMode(HSB, 360, 100, 100);
  img = loadImage('https://cdn.glitch.com/ea02f1d7-705c-44f8-89fc-de6985c70d8f%2Fflappybird.jpg?v=1627589347164');
  score = 0;
  lives = 0;
  gameIsOver = false;
  
  bird = new Bird();
  pipes = [];
  pipes.push(new Pipe());
  
  coins = [];
  coins.push(new Coin());


}

function draw(){
  background(200,10,100);
  image(img, 0, 0, 400, 600);
  
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();
    pipes[i].fly(bird);
    pipes[i].speedup();
    
    if (pipes[i].hits(bird)) {
      lives --;
      if (lives < 0) {
        gameIsOver = true;
      }
    }
  
    
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }
  
  for (let i = coins.length - 1; i >= 0; i--) {
    coins[i].show();
    coins[i].powerup(bird);
    coins[i].update();
    coins[i].speedup();
    
    if (coins[i].offscreen()) {
      coins.splice(i, 1);
    }
  }

  bird.show();
  bird.update();
  
  if (frameCount % 80 == 0){
      pipes.push(new Pipe());
  }
  if (frameCount % 100 == 0){
      coins.push(new Coin());
  }
  
  displayScores();
}

function mouseClicked() {
    bird.up();
}


function displayScores() {
  fill(0);
  textSize(15);
  text(`Score: ${score}`, 20, 30);
  text(`Number of lives: ${lives}`, 20, 50)
  if (gameIsOver) {
    fill('red');
    textSize(20);
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2);
    noLoop();
  }
}


class Bird {
  constructor() {
    this.y = height/2;
    this.x = 50
    this.gravity = 0.5;
    this.velocity = 0;
    this.lift = 13;
  }
  
  show() {
    fill(60, 100, 100);
    ellipse(this.x, this.y, 25);
  }
  
  update() {
    this.y += this.velocity;
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    
    if(this.y > height) {
      this.y = height;
      this.velocity = 0;
      gameIsOver = true;
    }
    
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
  
  up() {
    this.velocity -= this.lift;
    
  }
}

class Pipe {
  constructor() {
    this.top = random(height/2);
    this.bottom = height - (this.top + random(70, 180));
    this.x = width;
    this.w = 50;
    this.speed = 4;
    
  }
  show() {
    fill(150,160,290);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height-this.bottom, this.w, this.bottom);
  }
  
  update() {
    this.x -= this.speed;
  }
  
  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
  
  hits(bird) {
    if (bird.y < this.top || bird.y > height - this.bottom){
      if(bird.x > this.x && bird.x < this.x + 5){
        return true;
      } else {
        return false;
      }
    }
  }
  
  fly(bird) {
    if (bird.y > this.top && bird.y < height - this.bottom){
      if(bird.x > this.x && bird.x < this.x + 5){
        score ++
      }
    }
  }
  
  speedup() {
    if (score >= 50) {
      this.speed = 6;
      fill(0);
      textSize(20);
      text(`Getting faster!!`, width/2, 40);
    } else if (score >= 60) {
      this.speed = 7;
    } else if (score >= 90) {
      this.speed = 9;
    }
  }
}


class Coin {
  constructor() {
    this.x = width;
    this.y = random(100, 500);
    this.speed = 4
  }
  show() {
    fill(0, 100, 100);
    ellipse(this.x, this.y, 10);
    }
  
  powerup(bird) {
    if (collideCircleCircle(this.x, this.y, 10, bird.x, bird.y, 25)){
      lives ++;
      this.x = -10
      this.y = -10
    }
  }
   
  offscreen() {
    if (this.x < -10) {
      return true;
    } else {
      return false;
    }
  }
  
  update() {
    this.x -= this.speed;
  }
  
  speedup() {
    if (score >= 50) {
      this.speed = 6;
      fill(0);
      textSize(20);
      text(`Getting faster!!`, width/2, 40);
    } else if (score >= 60) {
      this.speed = 7;
    } else if (score >= 90) {
      this.speed = 9;
    }
  }
}