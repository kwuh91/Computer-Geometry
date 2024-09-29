// 03.js

"use strict";


const circle = function (ctx, x, у, radius, color, fillCircle = true) {
    ctx.beginPath();
    ctx.arc(x, у, radius, 0, Math.PI * 2, false);

    ctx.save();
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
    constructor(ctx, canvas_width, canvas_height, x = NaN, y = NaN, radius = NaN, color = NaN) {
        this.canvas_width  = canvas_width;
        this.canvas_height = canvas_height;

        if (isNaN(x)) 
            this.x = this.canvas_width  / 2;
        else 
            this.x = x
        if (isNaN(y))
            this.y = this.canvas_height / 2;
        else 
            this.y = y

        if (isNaN(radius))
            this.radius = 10;
        else 
            this.radius = radius

        this.speed = 5;
        this.speedIncr = 5;

        this.xSpeed = this.speed;
        this.ySpeed = 0;

        this.lastDirection = {axis: "x", speed: this.xSpeed};

        this.color = color || 'white'

        this.ctx = ctx;
    }

    draw() {
        circle(this.ctx, this.x, this.y, this.radius, this.color);
    }

    move(direction_element) {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // check for canvas borders
        if (this.x - this.radius <= 0) {
            this.xSpeed *= -1;
            this.lastDirection = {axis: "x", speed: this.xSpeed};
        } else if (this.x + this.radius >= this.canvas_width) {
            this.xSpeed *= -1;
            this.lastDirection = {axis: "x", speed: this.xSpeed};
        }

        if (this.y - this.radius <= 0) {
            this.ySpeed *= -1;
            this.lastDirection = {axis: "y", speed: this.ySpeed};
        } else if (this.y + this.radius >= this.canvas_height) {
            this.ySpeed *= -1;
            this.lastDirection = {axis: "y", speed: this.ySpeed};
        }

        if (this.xSpeed + this.ySpeed < 0) {
            updateStat(direction_element, "negative")
        } else {
            updateStat(direction_element, "positive")
        }
    }

    setDirection(direction, direction_element, axis_element, speed_element) {
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            if (direction === "up" ) {
                this.xSpeed = 0;
                this.ySpeed = -this.speed ;
                this.lastDirection = {axis: "y", speed: this.ySpeed};
                updateStat(direction_element, "negative")
                updateStat(axis_element, "y")

            } else if (direction === "down") { 
                this.xSpeed = 0;
                this.ySpeed = this.speed;
                this.lastDirection = {axis: "y", speed: this.ySpeed};
                updateStat(direction_element, "positive")
                updateStat(axis_element, "y")

            } else if (direction === "left") { 
                this.xSpeed = -this.speed;
                this.ySpeed = 0;
                this.lastDirection = {axis: "x", speed: this.xSpeed};
                updateStat(direction_element, "negative")
                updateStat(axis_element, "x")

            } else if (direction === "right") { 
                this.xSpeed = this.speed;
                this.ySpeed = 0;
                this.lastDirection = {axis: "x", speed: this.xSpeed};
                updateStat(direction_element, "positive")
                updateStat(axis_element, "x")
            }
        } 
        
        if (direction === "stop") { 
            if (this.xSpeed === 0 && this.ySpeed === 0) {
                if (this.lastDirection.axis === "x") {
                    this.xSpeed = this.lastDirection.speed
                } else {
                    this.ySpeed = this.lastDirection.speed
                }
                updateStat(speed_element, Math.abs(this.lastDirection.speed))
            } else {
                this.xSpeed = 0;
                this.ySpeed = 0;
                updateStat(speed_element, 0)
            }
        }
    }

    processAction(action, radius_element, speed_element) {
        switch (action) {
            case "slowDown": {
                this.decreaseSpeed(speed_element);
                break;
            }
            case "speedUp": {
                this.increaseSpeed(speed_element)
                break;
            }
            case "decreaseSize": {
                this.decreaseRadius(radius_element);
                break;
            }
            case "increaseSize": {
                this.increaseRadius(radius_element);
                break;
            }
        }
    }

    setSpeed(speed, speed_element) {
        if (this.xSpeed != 0) {
            this.xSpeed < 0 ? this.xSpeed = -speed : this.xSpeed = speed;
            this.speed = Math.abs(this.xSpeed)
            updateStat(speed_element, speed)
        }
        else if (this.ySpeed != 0) {
            this.ySpeed < 0 ? this.ySpeed = -speed : this.ySpeed = speed;
            this.speed = Math.abs(this.ySpeed)
            updateStat(speed_element, speed)
        }
    }

    increaseSpeed(speed_element) {
        if (this.xSpeed != 0) {
            this.xSpeed < 0 ? this.xSpeed -= this.speedIncr : this.xSpeed += this.speedIncr;
            this.speed = Math.abs(this.xSpeed)
            updateStat(speed_element, this.speed)
        }
        else if (this.ySpeed != 0) {
            this.ySpeed < 0 ? this.ySpeed -= this.speedIncr : this.ySpeed += this.speedIncr;
            this.speed = Math.abs(this.ySpeed)
            updateStat(speed_element, this.speed)
        }
    }

    decreaseSpeed(speed_element) {
        if ((Math.abs(this.xSpeed) - this.speedIncr > 0)) {
            this.xSpeed < 0 ? this.xSpeed += this.speedIncr : this.xSpeed -= this.speedIncr;
            this.speed = Math.abs(this.xSpeed)
            updateStat(speed_element, this.speed);
            
        } else if ((Math.abs(this.ySpeed) - this.speedIncr > 0)) {
            this.ySpeed < 0 ? this.ySpeed += this.speedIncr : this.ySpeed -= this.speedIncr;
            this.speed = Math.abs(this.ySpeed)
            updateStat(speed_element, this.speed);
        }  
    }

    increaseRadius(radius_element) {
        this.radius += 5;
        updateStat(radius_element, this.radius)
    }

    decreaseRadius(radius_element) {
        if (this.radius != 5) {
            this.radius -= 5;
            updateStat(radius_element, this.radius)
        }

    }

    randomizeColor(color_element) {
        this.color = getRandomBallColor();
        let n_match = ntc.name(this.color)
        let n_name = n_match[1];
        updateStat(color_element, n_name)
    }
}


function updateStat(element, newValue) {
    let oldText = element.textContent
    let newText = ""

    for (let character of oldText) {
        if (character !== ':') {
            newText += character
        } else {
            newText += `: ${newValue}`
            break;
        }
    }

    element.textContent = newText;
}


function main() {
    // Retrieve <canvas> element
    const canvas         = document.getElementById('mycanvas');

    const pSpeedButton   = document.getElementById('speed-plus');
    const mSpeedButton   = document.getElementById('speed-minus');
    const pRadiusButton  = document.getElementById('radius-plus');
    const mRadiusButton  = document.getElementById('radius-minus');
    const randomizeColor = document.getElementById('randomize-color');

    const currentSpeed     = document.getElementById('speed');
    const currentRadius    = document.getElementById('radius');
    const currentColor     = document.getElementById('color'); 
    const currentDirection = document.getElementById('direction'); 
    const currentAxis      = document.getElementById('axis'); 

    const ctx = canvas.getContext("2d") ;

    canvas.width  = window.innerWidth * 0.99
    canvas.height = window.innerHeight * 0.99

    const ball = new Ball(ctx, canvas.width, canvas.height);

    const directionKeyActions = {
        " " :          "stop",  // пробел
        "ArrowLeft" :  "left",  // влево
        "ArrowUp" :    "up",    // вверх
        "ArrowRight" : "right", // вправо
        "ArrowDown" :  "down",  // вниз
    };

    const extraKeyActions = {
        "z" : "slowDown",  
        "x" : "speedUp",  
        "c" : "decreaseSize",    
        "v" : "increaseSize", 
    };

    function action(event) {
        const direction = directionKeyActions[event.key];
        ball.setDirection(direction, currentDirection, currentAxis, currentSpeed);

        const action = extraKeyActions[event.key];
        ball.processAction(action, currentRadius, currentSpeed);

        if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) {
            ball.setSpeed(Number(event.key), currentSpeed)
        }
    }

    window.addEventListener("keydown", action, false);

    pSpeedButton.addEventListener('click', () => {
        ball.increaseSpeed(currentSpeed)
    });

    mSpeedButton.addEventListener('click', () => {
        ball.decreaseSpeed(currentSpeed)
    });

    pRadiusButton.addEventListener('click', () => {
        ball.increaseRadius(currentRadius)
    }); 

    mRadiusButton.addEventListener('click', () => {
        ball.decreaseRadius(currentRadius)
    }); 

    randomizeColor.addEventListener('click', () => {
        ball.randomizeColor(currentColor)
    });

    // mouse logic
    const staticBalls = []

    function mouseAction(event) {
        const staticBall = new Ball(ctx, canvas.width, canvas.height, event.clientX, event.clientY, 2.5, getRandomBallColor());

        staticBalls.push(staticBall)
    }    

    function staticBallLogic(value, index, array) {
        value.draw()
    }

    window.addEventListener("click", mouseAction);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        staticBalls.forEach(staticBallLogic);

        ball.draw(); 
        ball.move(currentDirection);

        requestAnimationFrame(animate);
	}
	
	animate();
}
