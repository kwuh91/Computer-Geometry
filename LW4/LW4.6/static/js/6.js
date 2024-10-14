// 04.js

"use strict";

class Timer {
    constructor(ctx, canvas_width, canvas_height) {
        this.ctx = ctx;

        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;

        this.rotationAngle = 0; // Initialize rotation angle
        this.initialLaunch = true;
        // this.rotationInterval = null; // To store interval ID
        this.lastTime = 0;

        this.initialCenter = {
            x: canvas_width / 2,
            y: canvas_height / 2        
        };
        
        // timer
        this.timerImg = new Image();
        this.timerImg.src = '../../images/stopwatch2.png'
        this.timerCenter = {
            x: this.initialCenter.x - this.timerImg.naturalWidth/2,
            y: this.initialCenter.y - this.timerImg.naturalHeight/2
        }

        // seconds
        this.secondsImg = new Image();
        this.secondsImg.src = '../../images/second.png'
        this.secondsScale = 0.45
        this.secondsSize = {
            width:  this.secondsImg.naturalWidth * this.secondsScale,
            height: this.secondsImg.naturalHeight * this.secondsScale,
        }
        this.secondsCenter = {
            x: this.initialCenter.x - this.secondsSize.width / 2,
            y: this.initialCenter.y - this.secondsSize.height * 0.58
        }

        this.secondsIsAnimating = false;

        // minutes
        this.minutesImg = new Image();
        this.minutesImg.src = '../../images/minute.png'
        this.minutesScale = 0.125
        this.minutesSize = {
            width:  this.minutesImg.naturalWidth * this.minutesScale,
            height: this.minutesImg.naturalHeight * this.minutesScale,
        }
        this.minutesCenter = {
            x: this.initialCenter.x - this.minutesSize.width / 2,
            y: this.initialCenter.y - this.minutesSize.height * 0.7
        }

        // hours
        this.hoursImg = new Image();
        this.hoursImg.src = '../../images/hour.png'
        this.hoursScale = 0.2
        this.hoursSize = {
            width:  this.hoursImg.naturalWidth * this.hoursScale,
            height: this.hoursImg.naturalHeight * this.hoursScale,
        }
        this.hoursCenter = {
            x: this.initialCenter.x - this.hoursSize.width / 2,
            y: this.initialCenter.y - this.hoursSize.height * 0.58
        }
    }

    launchTimer() {
        if (this.initialLaunch) {
            this.initialLaunch = false;
            this.secondsIsAnimating = true;

            requestAnimationFrame((timestamp) => this.animateRotation(timestamp));
        }

        // Start rotating the image every second
        // this.rotationInterval = setInterval(() => {
        //     this.rotationAngle += 2 * Math.PI / 60; // 10 degrees in radians
        //     this.draw(); // Redraw after updating rotation
        // }, 1000); // Every second

        // this.rotationAngle += Math.PI / 12; 
        // this.draw(); 
    }

    animateRotation(timestamp) {
        if (!this.secondsIsAnimating) return; // Stop animation if not needed

        // Calculate the time difference (in milliseconds)
        if (!this.lastTime) this.lastTime = timestamp;
        const elapsedTime = timestamp - this.lastTime;

        // Rotate every second (1000 milliseconds)
        if (elapsedTime >= 1000) {
            this.rotationAngle += 2 * Math.PI / 60; 
            this.lastTime = timestamp; // Reset last time
        }

        // Redraw the scene with the updated rotation
        this.draw();

        // Continue the animation
        requestAnimationFrame((newTimestamp) => this.animateRotation(newTimestamp));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height); // Clear canvas
        // this.ctx.save();

        // this.ctx.translate(this.initialCenter.x, this.initialCenter.y);

        // draw timer body
        this.drawTimer();

        // draw seconds
        this.drawSeconds();

        // draw minutes
        // this.drawMinutes();

        // // draw hours
        // this.drawHours();

        // this.ctx.restore();
    }

    drawTimer() {
        if (this.initialLaunch) {
            this.timerImg.onload = () => {
                this.ctx.drawImage(this.timerImg, 
                                   this.timerCenter.x, 
                                   this.timerCenter.y, 
                                   this.timerImg.naturalWidth, 
                                   this.timerImg.naturalHeight);
            };
        } else {
            // this.ctx.save();
            this.ctx.drawImage(this.timerImg, 
                               this.timerCenter.x, 
                               this.timerCenter.y, 
                               this.timerImg.naturalWidth, 
                               this.timerImg.naturalHeight);
            // this.ctx.restore();
        }
    }

    // drawSeconds() {
    //     this.secondsImg.onload = () => {
    //         this.ctx.drawImage(this.secondsImg, 
    //                            this.secondsCenter.x, 
    //                            this.secondsCenter.y, 
    //                            this.secondsSize.width, 
    //                            this.secondsSize.height);
    //     };
    // }

    drawSeconds() {
        if (this.initialLaunch) {
            this.secondsImg.onload = () => {
                this.ctx.drawImage(this.secondsImg, 
                                   this.secondsCenter.x, 
                                   this.secondsCenter.y, 
                                   this.secondsSize.width, 
                                   this.secondsSize.height);
            };
        } else {
            // Rotate around the center and draw the image
            this.ctx.save();

            this.ctx.translate(this.initialCenter.x, this.initialCenter.y * 1.075); // actual center offset

            // this.ctx.fillStyle = 'red';
            // this.ctx.beginPath();
            // this.ctx.arc(0, 0, 5, 0, 2 * Math.PI); // (x, y, radius, startAngle, endAngle)
            // this.ctx.fill();

            this.ctx.rotate(this.rotationAngle); // Apply rotation

            // Draw the seconds hand, adjusting to draw from its center
            this.ctx.drawImage(this.secondsImg,  
                            -this.secondsSize.width / 2, 
                            -this.secondsSize.height * 0.7325, // relative center offset
                            this.secondsSize.width, 
                            this.secondsSize.height);

            this.ctx.restore();
        }
    }

    drawMinutes() {
        this.minutesImg.onload = () => {
            this.ctx.drawImage(this.minutesImg, 
                               this.minutesCenter.x, 
                               this.minutesCenter.y, 
                               this.minutesSize.width, 
                               this.minutesSize.height);
        };
    }

    drawHours() {
        this.hoursImg.onload = () => {
            this.ctx.drawImage(this.hoursImg, 
                               this.hoursCenter.x, 
                               this.hoursCenter.y, 
                               this.hoursSize.width, 
                               this.hoursSize.height);
        };
    }
}   

function main() {
    // Retrieve <canvas> element
    const canvas = document.getElementById('mycanvas');

    const ctx = canvas.getContext("2d") ;

    canvas.width  = window.innerWidth * 0.99
    canvas.height = window.innerHeight * 0.99

    const timer = new Timer(ctx, canvas.width, canvas.height);
    timer.draw();

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.code === 'Space') {
            timer.launchTimer();
        }
    });
    
}
