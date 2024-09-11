// 01.js

"use strict";

function myGradientRectangle(ctx:    CanvasRenderingContext2D | null, 
                             x0:     number, 
                             y0:     number, 
                             width:  number, 
                             height: number,
                             color1: string = 'red',
                             color2: string = 'green'): void {

    const gx0: number = x0;
	const gy0: number = y0;
	const gx1: number = x0 + width / 6.5;
	const gy1: number = y0 + height;
    
    if (ctx) {
        const old_fillStyle:   string | CanvasGradient | CanvasPattern = ctx.fillStyle
        const old_strokeStyle: string | CanvasGradient | CanvasPattern = ctx.strokeStyle

        const gradient: CanvasGradient = ctx.createLinearGradient(gx0, gy0, gx1, gy1);

        gradient.addColorStop(0, color1); 
        gradient.addColorStop(1, color2); 

        ctx.fillStyle   = gradient;
        ctx.strokeStyle = gradient;

        ctx.fillRect(x0, y0, width, height)

        ctx.fillStyle   = old_fillStyle;
        ctx.strokeStyle = old_strokeStyle;   
    }
}

function getRandomColor(): string {
    var letters: string = '0123456789ABCDEF';
    var color:   string = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawRectangles(ctx:          CanvasRenderingContext2D | null, 
                        canvasWidth:  number, 
                        canvasHeight: number,
                        rectWidth:    number = 300,
                        rectHeight:   number = 100,): void {

            // const width:  number = 300 
            // const height: number = 100

            const spaceInBetweenVertically:   number = rectHeight * 0.1
            const spaceInBetweenHorizontally: number = rectWidth  * 0

            const heightRange:         number = canvasHeight - rectHeight
            const maxAmountVertically: number = Math.floor(canvasHeight / (rectHeight + spaceInBetweenVertically))
            
            const widthRange:            number = canvasWidth - rectWidth
            const maxAmountHorizontally: number = Math.floor(canvasWidth / (rectWidth + spaceInBetweenHorizontally))

            for (let x0 = 10; x0 < widthRange; x0 += canvasWidth / maxAmountHorizontally){
                for (let y0 = 5; y0 < heightRange; y0 += canvasHeight / maxAmountVertically) { 
                    const randomColor1: string = getRandomColor()
                    const randomColor2: string = getRandomColor()

                    myGradientRectangle(ctx, x0, y0, rectWidth, rectHeight, randomColor1, randomColor2); 
                }
            }


}

function main2(): void {
	// Retrieve <canvas> element
	const canvas = document.getElementById(
		"mycanvas"
	) as HTMLCanvasElement | null;
	console.assert(canvas, "Failed to retrieve the <canvas> element");

    if (canvas) {

        // Set the canvas width and height to fill the whole screen
        canvas.width  = window.innerWidth * 0.99;
        canvas.height = window.innerHeight * 0.98;

		// Get the rendering context for 2DCG
		const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

		if (ctx) {
            // clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // fill the background
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // drawRectangles(ctx, canvas.width, canvas.height, canvas.width - 10.1, canvas.height - 5.1);

            drawRectangles(ctx, canvas.width, canvas.height);

        } else {
            console.error("Failed to get the 2D rendering context");
        }
    }
}

setInterval(main2, 100);