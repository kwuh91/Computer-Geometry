"use strict";

function getRandomTriangleColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

class Triangle {
    constructor(ctx, canvas_width, canvas_height) {
        this.ctx = ctx;

        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;

        // Set the initial center of the canvas as the rotation point
        this.initialCenter = {
            x: canvas_width / 2,
            y: canvas_height / 2        
        };

        // Track the current horizontal position (relative to initial center)
        this.horizontalOffset = 0;

        this.speed = 5;
        this.rotationSpeed = 0.05;
        this.angle = 0; // Initial rotation angle

        this.color = getRandomTriangleColor();
        this.Radius = (Math.random() * canvas_height / 10) + (canvas_height / 10 * 2);

        // Vertices are defined relative to the triangle's local center (0, 0)
        [this.A, this.B, this.C] = Triangle.get_vertices(0, 0, this.Radius);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height); // Clear canvas
        this.ctx.save();

        this.ctx.translate(this.initialCenter.x, this.initialCenter.y);
        
        this.ctx.fillStyle = 'green';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5, 0, 2 * Math.PI); // (x, y, radius, startAngle, endAngle)
        this.ctx.fill();

        this.ctx.rotate(this.angle);

        // this.ctx.translate(this.horizontalOffset, 0); // 4.4
        this.ctx.translate(this.horizontalOffset * Math.cos(this.angle), this.horizontalOffset * Math.cos(Math.PI/2 + this.angle)); //4.5

        // this.ctx.translate(0, 0); // Move back to original center

        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5, 0, 2 * Math.PI); // (x, y, radius, startAngle, endAngle)
        this.ctx.fill();

        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.A.x, this.A.y);
        this.ctx.lineTo(this.B.x, this.B.y);
        this.ctx.lineTo(this.C.x, this.C.y);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    }

    update() {
        // Redraw the triangle
        this.draw();

        // Request the next animation frame
        requestAnimationFrame(() => this.update());
    }

    applyForce(direction) {
        switch (direction) {
            case 'left':
                this.horizontalOffset -= this.speed; // Move horizontally to the left
                break;
            case 'right':
                this.horizontalOffset += this.speed; // Move horizontally to the right
                break;
            case 'rotate_left':
                this.angle -= this.rotationSpeed; // Rotate counterclockwise
                break;
            case 'rotate_right':
                this.angle += this.rotationSpeed; // Rotate clockwise
                break;
        }
    }

    static get_vertices(x, y, Radius) {
        const radius = Radius / 2;
        const side = 2 * Radius * Math.sin(Triangle.degrees_to_radians(60));

        const A = { x: x - side / 2, y: y + radius }; // left lower vertex
        const B = { x: x, y: y - Radius }; // upper vertex
        const C = { x: x + side / 2, y: y + radius }; // right lower vertex

        return [A, B, C];
    }

    static degrees_to_radians(degree) {
        return degree * Math.PI / 180;
    }
}

function main() {
    const canvas = document.getElementById('mycanvas');
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth * 0.99;
    canvas.height = window.innerHeight * 0.99;

    // Create initial triangle
    const triangle = new Triangle(ctx, canvas.width, canvas.height);
    triangle.draw();
    triangle.update();

    const directionKeyActions = {
        "ArrowLeft": "left",        // Move left
        "ArrowRight": "right",      // Move right
        "ArrowUp": "rotate_left",   // Rotate counterclockwise
        "ArrowDown": "rotate_right" // Rotate clockwise
    };

    const keysPressed = {};

    window.addEventListener('keydown', (event) => {
        const direction = directionKeyActions[event.key];
        if (direction) {
            keysPressed[direction] = true;
        }
    });

    window.addEventListener('keyup', (event) => {
        const direction = directionKeyActions[event.key];
        if (direction) {
            keysPressed[direction] = false;
        }
    });

    function applyControls() {
        Object.keys(keysPressed).forEach(direction => {
            if (keysPressed[direction]) {
                triangle.applyForce(direction);
            }
        });
        requestAnimationFrame(applyControls);
    }

    applyControls();
}
