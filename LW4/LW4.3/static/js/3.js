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

        this.rotatedA = this.A
        this.rotatedB = this.B
        this.rotatedC = this.C

        this.vertices = [this.A, this.B, this.C];

        this.rotatedVertices = [this.rotatedA, this.rotatedB, this.rotatedC];

        this.selectedVertex = this.A;

        this.selectedRotatedVertex = this.selectedVertex

        this.horizontalDirection = true;
        // this.rotationAngle = 0; 

        this.currentScale = 1;

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

        // this.circle(this.selectedVertex.x, this.selectedVertex.y);

        this.ctx.restore();
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);

        this.draw();
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

    rotateTo(targetDegrees) {
        const targetRadians = Triangle.degrees_to_radians(targetDegrees);
        const step = Triangle.degrees_to_radians(1); 
        const direction = targetRadians > 0 ? 1 : -1;

        let currentRadians = 0;
        const rotateStep = () => {
            if (Math.abs(currentRadians - targetRadians) > step) {
                currentRadians += step * direction;

                requestAnimationFrame(rotateStep);
            } else {
                // Ensure the final angle is exactly the target angle
                currentRadians = targetRadians;
            }

            // Move the origin to the triangle's selected vertex
            this.ctx.translate(this.selectedVertex.x, this.selectedVertex.y);

            this.ctx.rotate(currentRadians);
            
            // Move back after rotation (draw the triangle around the translated center)
            this.ctx.translate(-this.selectedVertex.x, -this.selectedVertex.y);

            // update vertices after rotation
            let ind = 0;
            for (let vertex of this.vertices) {
                if (Math.abs(this.selectedVertex.x - vertex.x) > 0.5 || Math.abs(this.selectedVertex.y - vertex.y) > 0.5) {
                    this.rotatedVertices[ind] = Triangle.getVertexCoordinatesAfterRotation(this.rotatedVertices[ind], this.selectedRotatedVertex, currentRadians);
                }
                ind += 1;
            }

            this.redraw();
        };

        requestAnimationFrame(rotateStep); // Start the animation
    }

    scale(endScale) {
        const step = 0.01; 
        const direction = endScale > 0 ? 1 : -1;
        endScale = this.currentScale + endScale;

        const scaleStep = direction * step;

        const scaleAnimation = () => {
            this.currentScale += scaleStep;

            this.ctx.setTransform(1, 0, 0, 1, 0, 0);

            this.ctx.translate(this.center.x, this.center.y);

            // this.horizontalDirection ? this.ctx.scale(this.currentScale, 1) : this.ctx.scale(1, this.currentScale);
            this.ctx.scale(this.currentScale, this.currentScale);

            this.ctx.translate(-this.center.x, -this.center.y);

            this.redraw();

            if ((direction > 0 && this.currentScale < endScale) || (direction < 0 && this.currentScale > endScale)) {
                requestAnimationFrame(scaleAnimation);
            } else {
                this.currentScale = endScale;
            }
        };

        requestAnimationFrame(scaleAnimation);
    }

    toggleDirection() {
        if (this.horizontalDirection) {
            this.horizontalDirection = false;
        } else {
            this.horizontalDirection = true;
        }
    }

    // Rotate a point (vertex) around the selected vertex
    static getVertexCoordinatesAfterRotation(point, selectedVertex, angle) {
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);

        const dx = point.x - selectedVertex.x;
        const dy = point.y - selectedVertex.y;

        const rotatedX = cosTheta * dx - sinTheta * dy + selectedVertex.x;
        const rotatedY = sinTheta * dx + cosTheta * dy + selectedVertex.y;

        return { x: rotatedX, y: rotatedY };
    }

    circle(x, у) {
        this.ctx.beginPath();
        this.ctx.arc(x, у, this.Radius / 20, 0, Math.PI * 2, false);
    
        this.ctx.save();
        this.ctx.strokeStyle = "red";
    
        this.ctx.stroke();
    
        this.ctx.restore();
    };

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

function main() {
    // Retrieve <canvas> element
    const canvas = document.getElementById('mycanvas');

    const ctx = canvas.getContext("2d") ;

    canvas.width  = window.innerWidth * 0.99
    canvas.height = window.innerHeight * 0.99

    // create initial triangle
    const triangle = new Triangle(ctx, canvas.width, canvas.height);
    triangle.draw();

    // Mouse wheel event to rotate the triangle
    window.addEventListener('wheel', (event) => {
        triangle.scale(event.deltaY / 102);
    });

    // change dir
    // window.addEventListener("keydown", (event) => {
    //     if (event.key === ' ') 
    //         triangle.toggleDirection();

    //     console.log(`horizontal direction?: ${triangle.horizontalDirection}`);
    // });
}
