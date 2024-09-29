// 02.js

"use strict";

function circle(ctx, x, y, radius, color, fillCircle = true) {
    console.log(`drawing circle`)
    console.log(`x: ${x}, y: ${y}, radius: ${radius}, fillCircle: ${fillCircle}`)

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);

    ctx.save()
    ctx.fillStyle = color;

    if (fillCircle)
        ctx.fill();
    else
        ctx.stroke();

    ctx.restore();
};

function getRandomBallColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

class Ball {
    constructor(ctx, maxWidth, maxHeight) {
        this.maxWidth  = maxWidth;
        this.maxHeight = maxHeight;

        this.xSpeed = (Math.random() * 5) * ((Math.floor(Math.random() * 10) % 2) ? -1 : 1);
        this.ySpeed = (Math.random() * 5) * ((Math.floor(Math.random() * 10) % 2) ? -1 : 1);

        this.radius = (Math.random() * 8) + 2;

        this.x = Math.random() * (this.maxWidth  - 2 * this.radius) + this.radius;
        this.y = Math.random() * (this.maxHeight - 2 * this.radius) + this.radius;

        this.color = getRandomBallColor();

        this.ctx = ctx;
    }

    draw() {
        circle(this.ctx, this.x, this.y, this.radius, this.color);
    }

    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    checkCollision() {
        if (this.x - this.radius < 0 || 
            this.x + this.radius > this.maxWidth) {
            this.xSpeed = -this.xSpeed;
        } 

        if (this.y - this.radius < 0 || 
            this.y + this.radius > this.maxHeight)
            this.ySpeed = -this.ySpeed;
    } 
}

function makeElementDraggable(element) {
    var mousePosition;
    var offset = [0,0];
    var isDown = false;

    element.addEventListener('mousedown', function(e) {
        isDown = true;
        offset = [
            element.offsetLeft - e.clientX,
            element.offsetTop - e.clientY
        ];
    }, true);

    document.addEventListener('mouseup', function() {
        isDown = false;
    }, true);

    document.addEventListener('mousemove', function(event) {
        event.preventDefault();
        if (isDown) {
            mousePosition = {

                x : event.clientX,
                y : event.clientY

            };
            element.style.left = (mousePosition.x + offset[0]) + 'px';
            element.style.top  = (mousePosition.y + offset[1]) + 'px';
        }
    }, true);
}

function main(initialCanvasWidth = 400, initialCanvasHeight = 400) {
    const canvas         = document.getElementById('mycanvas');
    const ballCounter    = document.getElementById('ballCounter');
    const plusButton     = document.getElementById('plus');
    const minusButton    = document.getElementById('minus');

    const canvasWidth  = initialCanvasWidth;  // todo: make resizable
    const canvasHeight = initialCanvasHeight; // todo: make resizable

    canvas.width  = canvasWidth
    canvas.height = canvasHeight

    // draggable logic
    canvas.style.position = "absolute";

    makeElementDraggable(canvas, initialCanvasWidth, initialCanvasHeight)

    // counter logic
    let counterValue = 1;

    function updateCounter() {
        ballCounter.textContent = counterValue;
    }

    function increaseCounter() {
        balls.push(new Ball(ctx, canvasWidth, canvasHeight))
        counterValue++;
        updateCounter();
    }

    function decreaseCounter() {
        if (ballCounter.textContent > 0) {
            balls.pop()
            counterValue--;
            updateCounter();
        }
    }

    plusButton.addEventListener('click', increaseCounter);
    minusButton.addEventListener('click', decreaseCounter);

    // canvas logic
    const ctx = canvas.getContext("2d") ;

    const balls = []
    const initialBall = new Ball(ctx, canvasWidth, canvasHeight);
    balls.push(initialBall)

    function ballLogic(value, index, array) {
        value.draw()
        value.move();
        value.checkCollision();
    }

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        balls.forEach(ballLogic);
        
        requestAnimationFrame(animate);
    }
  
    animate();
}
