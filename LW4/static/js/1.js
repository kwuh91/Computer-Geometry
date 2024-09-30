// 04.js

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

        this.center = {
            x: canvas_width / 2,
            y: canvas_height / 2        
        };

        this.color = getRandomTriangleColor();

        this.Radius = (Math.random() * canvas_height / 10) + (canvas_height / 10 * 2);

        [this.A, this.B, this.C] = Triangle.get_vertices(this.center.x, this.center.y, this.Radius);

        this.vertices = [this.A, this.B, this.C];

        this.isMoving = false;
    }

    draw() {
        this.ctx.save();

        this.ctx.strokeStyle = this.color;

        this.ctx.beginPath();
        this.ctx.moveTo(this.A.x, this.A.y);
        this.ctx.lineTo(this.B.x, this.B.y);
        this.ctx.lineTo(this.C.x, this.C.y);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    }

    move(targetX, targetY) {
        let dx = (targetX - this.center.x) / 60;
        let dy = (targetY - this.center.y) / 60;

        const moveStep = () => {
            this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);

            this.center.x += dx;
            this.center.y += dy;

            [this.A, this.B, this.C] = Triangle.get_vertices(this.center.x, this.center.y, this.Radius);
            this.vertices = [this.A, this.B, this.C];

            this.draw();

            if (Math.abs(this.center.x - targetX) > 0.5 || Math.abs(this.center.y - targetY) > 0.5) {
                this.isMoving = true;

                requestAnimationFrame(moveStep);
            } else {
                this.center.x = targetX;
                this.center.y = targetY;
                [this.A, this.B, this.C] = Triangle.get_vertices(this.center.x, this.center.y, this.Radius);
                this.vertices = [this.A, this.B, this.C];
                this.draw();

                this.isMoving = false;
            }
        };

        requestAnimationFrame(moveStep);
    }

    static get_vertices(x, y, Radius) {
        const center = {
            x: x,
            y: y
        }

        const radius = Radius / 2;
        const side = 2 * Radius * Math.sin(Triangle.degrees_to_radians(60));

        const A = {
            x: center.x - side / 2,
            y: center.y + radius 
        }; // left lower vertex

        const B = {
            x: center.x,
            y: center.y - Radius
        }; // upper vertex

        const C = {
            x: center.x + side / 2,
            y: center.y + radius
        } // right lower vertex

        const vertices = [A, B, C];

        return vertices;
    }

    static degrees_to_radians(degree) {
        return degree * Math.PI / 180;
    }
}

function main1() {
    // Retrieve <canvas> element
    const canvas = document.getElementById('mycanvas');

    const ctx = canvas.getContext("2d") ;

    canvas.width  = window.innerWidth * 0.99
    canvas.height = window.innerHeight * 0.99

    // create initial triangle
    const triangle = new Triangle(ctx, canvas.width, canvas.height);
    triangle.draw();

    // move logic
    function mouseAction(event) {
        if (!triangle.isMoving)
            triangle.move(event.clientX, event.clientY);
    }    

    window.addEventListener("click", mouseAction);
}
