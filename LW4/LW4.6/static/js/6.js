// 04.js

"use strict";

class Timer {
    #secondsImageScaleCoeff = 0.45;
    #minutesImageScaleCoeff = 0.125;
    #hoursImageScaleCoeff   = 0.2;

    #secondsImageRelativeCenterOffsetCoeffInit = 0.58;
    #minutesImageRelativeCenterOffsetCoeffInit = 0.7;
    #hoursImageRelativeCenterOffsetCoeffInit   = 0.58;

    #imageAbsoluteCenterOffsetTranslate = 1.075;

    #secondsImageRelativeCenterOffsetCoeffTranslate = 0.7325;
    #minutesImageRelativeCenterOffsetCoeffTranslate = 0.9525;
    #hoursImageRelativeCenterOffsetCoeffTranslate   = 0.86;

    #one60thOfACircle = 2 * Math.PI / 60;

    #oneSecondInMilliseconds = 1000;
    #oneMinuteInMilliseconds = this.#oneSecondInMilliseconds * 61;
    #oneHourInMilliseconds   = this.#oneMinuteInMilliseconds * 61;

    constructor(ctx, canvas_width, canvas_height) {
        this.ctx = ctx;

        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;

        this.secondsRotationAngle = 0;
        this.minutesRotationAngle = 0;
        this.hoursRotationAngle   = 0;

        this.initialLaunch = true;

        this.lastSecondsTime = 0;
        this.lastMinutesTime = 0;
        this.lastHoursTime   = 0;

        this.initialCenter = {
            x: canvas_width  / 2,
            y: canvas_height / 2        
        };
        
        this.isAnimating = false;

        // timer
        this.timerImg = new Image();
        this.timerImg.src = '../../images/stopwatch2.png'
        this.timerCenter = {
            x: this.initialCenter.x - this.timerImg.naturalWidth  / 2,
            y: this.initialCenter.y - this.timerImg.naturalHeight / 2
        }
        console.log(`timer natural width:${this.timerImg.naturalWidth}`)   // 612 
        console.log(`timer natural height:${this.timerImg.naturalHeight}`) // 612

        // seconds
        this.secondsImg = new Image();
        this.secondsImg.src = '../../images/second.png'
        this.secondsScale = this.#secondsImageScaleCoeff;
        this.secondsSize = {
            width:  this.secondsImg.naturalWidth  * this.secondsScale,
            height: this.secondsImg.naturalHeight * this.secondsScale,
        }
        this.secondsCenter = {
            x: this.initialCenter.x - this.secondsSize.width / 2,
            y: this.initialCenter.y - this.secondsSize.height * this.#secondsImageRelativeCenterOffsetCoeffInit
        }
        console.log(`seconds natural width:${this.secondsImg.naturalWidth}`)   // 500
        console.log(`seconds natural height:${this.secondsImg.naturalHeight}`) // 500

        // minutes
        this.minutesImg = new Image();
        this.minutesImg.src = '../../images/minute.png'
        this.minutesScale = this.#minutesImageScaleCoeff;
        this.minutesSize = {
            width:  this.minutesImg.naturalWidth  * this.minutesScale,
            height: this.minutesImg.naturalHeight * this.minutesScale,
        }
        this.minutesCenter = {
            x: this.initialCenter.x - this.minutesSize.width / 2,
            y: this.initialCenter.y - this.minutesSize.height * this.#minutesImageRelativeCenterOffsetCoeffInit
        }
        console.log(`minutes natural width:${this.minutesImg.naturalWidth}`)   // 224
        console.log(`minutes natural height:${this.minutesImg.naturalHeight}`) // 1111

        // hours
        this.hoursImg = new Image();
        this.hoursImg.src = '../../images/hour.png'
        this.hoursScale = this.#hoursImageScaleCoeff;
        this.hoursSize = {
            width:  this.hoursImg.naturalWidth  * this.hoursScale,
            height: this.hoursImg.naturalHeight * this.hoursScale,
        }
        this.hoursCenter = {
            x: this.initialCenter.x - this.hoursSize.width / 2,
            y: this.initialCenter.y - this.hoursSize.height * this.#hoursImageRelativeCenterOffsetCoeffInit
        }
        console.log(`hours natural width:${this.hoursImg.naturalWidth}`)   // 360
        console.log(`hours natural height:${this.hoursImg.naturalHeight}`) // 621
    }

    launchTimer() {
        if (this.initialLaunch) {
            this.initialLaunch = false;
            this.isAnimating = true;

            requestAnimationFrame((timestamp) => this.animateRotation(timestamp));
        }
    }

    animateRotation(timestamp) {
        if (!this.isAnimating) return; // Stop animation if not needed

        // Calculate the time difference (in milliseconds)
        if (!this.lastSecondsTime) this.lastSecondsTime = timestamp;
        const elapsedSecondsTime = timestamp - this.lastSecondsTime;

        if (!this.lastMinutesTime) this.lastMinutesTime = timestamp;
        const elapsedMinutesTime = timestamp - this.lastMinutesTime;

        if (!this.lastHoursTime) this.lastHoursTime = timestamp;
        const elapsedHoursTime = timestamp - this.lastHoursTime;

        // Rotate every second (1000 milliseconds)
        if (elapsedSecondsTime >= this.#oneSecondInMilliseconds) {
            this.secondsRotationAngle += this.#one60thOfACircle;
            this.lastSecondsTime = timestamp; // Reset last time
        }

        // Rotate every minute (60000 milliseconds)
        if (elapsedMinutesTime >= this.#oneMinuteInMilliseconds) {
            this.minutesRotationAngle += this.#one60thOfACircle;
            this.lastMinutesTime = timestamp; // Reset last time
        }

        // Rotate every hour (3600000 milliseconds)
        if (elapsedHoursTime >= this.#oneHourInMilliseconds) {
            this.hoursRotationAngle += this.#one60thOfACircle;
            this.lastHoursTime = timestamp; // Reset last time
        }

        // Redraw the scene with the updated rotation
        this.draw();

        // Continue the animation
        requestAnimationFrame((newTimestamp) => this.animateRotation(newTimestamp));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height); // Clear canvas

        // draw timer body
        this.drawTimer();

        // draw seconds
        this.drawSeconds();

        // draw minutes
        this.drawMinutes();

        // draw hours
        this.drawHours();
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
            this.ctx.drawImage(this.timerImg, 
                               this.timerCenter.x, 
                               this.timerCenter.y, 
                               this.timerImg.naturalWidth, 
                               this.timerImg.naturalHeight);
        }
    }

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

            this.ctx.translate(this.initialCenter.x, this.initialCenter.y * this.#imageAbsoluteCenterOffsetTranslate); // actual center offset

            this.ctx.rotate(this.secondsRotationAngle); // Apply rotation

            // Draw the seconds hand, adjusting to draw from its center
            this.ctx.drawImage(this.secondsImg,  
                              -this.secondsSize.width / 2, 
                              -this.secondsSize.height * this.#secondsImageRelativeCenterOffsetCoeffTranslate, // relative center offset
                               this.secondsSize.width, 
                               this.secondsSize.height);

            this.ctx.restore();
        }
    }

    drawMinutes() {
        if (this.initialLaunch) {
            this.minutesImg.onload = () => {
                this.ctx.drawImage(this.minutesImg, 
                                   this.minutesCenter.x, 
                                   this.minutesCenter.y, 
                                   this.minutesSize.width, 
                                   this.minutesSize.height);
            };
        } else {
            // Rotate around the center and draw the image
            this.ctx.save();

            this.ctx.translate(this.initialCenter.x, this.initialCenter.y * this.#imageAbsoluteCenterOffsetTranslate); // actual center offset

            this.ctx.rotate(this.minutesRotationAngle); // Apply rotation

            // Draw the seconds hand, adjusting to draw from its center
            this.ctx.drawImage(this.minutesImg,  
                              -this.minutesSize.width / 2, 
                              -this.minutesSize.height * this.#minutesImageRelativeCenterOffsetCoeffTranslate, // relative center offset
                               this.minutesSize.width, 
                               this.minutesSize.height);

            this.ctx.restore();
        }
    }

    drawHours() {
        if (this.initialLaunch) {
            this.hoursImg.onload = () => {
                this.ctx.drawImage(this.hoursImg, 
                                   this.hoursCenter.x, 
                                   this.hoursCenter.y, 
                                   this.hoursSize.width, 
                                   this.hoursSize.height);
            };
        } else {
            // Rotate around the center and draw the image
            this.ctx.save();

            this.ctx.translate(this.initialCenter.x, this.initialCenter.y * this.#imageAbsoluteCenterOffsetTranslate); // actual center offset

            this.ctx.rotate(this.hoursRotationAngle); // Apply rotation

            // Draw the seconds hand, adjusting to draw from its center
            this.ctx.drawImage(this.hoursImg,  
                              -this.hoursSize.width / 2, 
                              -this.hoursSize.height * this.#hoursImageRelativeCenterOffsetCoeffTranslate, // relative center offset
                               this.hoursSize.width, 
                               this.hoursSize.height);

            this.ctx.restore();
        }
    }
}   

function main() {
    // Retrieve <canvas> element
    const canvas = document.getElementById('mycanvas');

    const ctx = canvas.getContext("2d") ;

    canvas.width  = window.innerWidth  * 0.99
    canvas.height = window.innerHeight * 0.99

    const timer = new Timer(ctx, canvas.width, canvas.height);
    timer.draw();

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.code === 'Space') {
            timer.launchTimer();
        }
    });
    
}
