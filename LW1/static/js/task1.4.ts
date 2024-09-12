"use strict";

function main4(vAmount: number = 4, indent: number = 50): void {
	// Retrieve <canvas> element
	const canvas = document.getElementById(
		"mycanvas"
	) as HTMLCanvasElement | null;

    if (canvas) { 
        // Get the rendering context for 2DCG
		const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

        if (ctx) {
            // Set the canvas width and height to fill the whole screen
            canvas.width  = window.innerWidth  * 0.99;
            canvas.height = window.innerHeight * 0.98;

            const options: Array<GlobalCompositeOperation> = ["source-out", "source-over", "destination-over", "lighter",                     
                                                              "xor",        "multiply",    "screen",           "overlay",        
                                                              "darken",     "lighten",     "color-dodge",      "color-burn",     
                                                              "hard-light", "soft-light",  "difference",       "exclusion",      
                                                              "hue",        "saturation",  "color",            "luminosity"]

            // const options: Array<GlobalCompositeOperation> = ["destination-atop",    
            //                                                   "destination-over",   
            //                                                   "lighter",          
            //                                                   "source-over",           
            //                                                   "xor"]

            const amountOfOptions: number = options.length

            // calculate square size for three squares to fit vertically
            let optimalVerticalIndent: number = indent
            const verticalIndentsSum:  number = indent * (vAmount + 1)
            const leftVerticalSpace:   number = canvas.height - verticalIndentsSum
            let   squareSize:          number = Math.floor(leftVerticalSpace / vAmount)
            let   oneSquareSize:       number = squareSize / 1.5

            function calculateHorizontalSquares(): Array<number> {
                const amountOfSquaresHorizontally: Array<number> = Array(vAmount).fill(Math.floor(amountOfOptions / vAmount))
                let left = amountOfOptions % vAmount;

                while (left > 0) {
                    amountOfSquaresHorizontally[left - 1]++;
                    left--;
                }

                return amountOfSquaresHorizontally
            }

            const amountOfSquaresHorizontally: Array<number> = calculateHorizontalSquares()

            const maxAmountOfSquaresHorizontally: number = amountOfSquaresHorizontally[0]
            const maxOccupiedHorizontalSpace: number = maxAmountOfSquaresHorizontally * squareSize
            if (maxOccupiedHorizontalSpace >= canvas.width) {
                const horizontalIndentsSum: number = indent * (maxAmountOfSquaresHorizontally + 1)
                const leftHorizontalSpace: number = canvas.width - horizontalIndentsSum
                squareSize = Math.floor(leftHorizontalSpace / maxAmountOfSquaresHorizontally)
                oneSquareSize = squareSize / 1.5

                const occupiedVerticalSpace: number = vAmount * squareSize 
                const leftVerticalSpace:     number = canvas.height - occupiedVerticalSpace
                optimalVerticalIndent               = leftVerticalSpace / (vAmount + 1)
            }

            let ind: number = 0
            let verticalCoord: number = optimalVerticalIndent
            for (const hAmount of amountOfSquaresHorizontally) {
                const occupiedHorizontalSpace: number = hAmount * squareSize 
                const leftHorizontalSpace:     number = canvas.width - occupiedHorizontalSpace
                const optimalHorizontalIndent: number = leftHorizontalSpace / (hAmount + 1)

                let horizontalCoord: number = optimalHorizontalIndent
                for (let hElement = 0; hElement < hAmount; hElement++){
                    function getRandomColor(): string {
                        var letters: string = '0123456789ABCDEF';
                        var color:   string = '#';
                        for (var i = 0; i < 6; i++) {
                            color += letters[Math.floor(Math.random() * 16)];
                        }
                        return color;
                    }

                    // console.log(options[ind], typeof options[ind]);
                    ctx.globalCompositeOperation = options[ind]

                    const color1: string = getRandomColor()
                    const color2: string = getRandomColor()

                    ctx.fillStyle = color1
                    ctx.fillRect(horizontalCoord, verticalCoord, oneSquareSize, oneSquareSize)

                    ctx.fillStyle = color2
                    ctx.fillRect(horizontalCoord + oneSquareSize / 2, verticalCoord + oneSquareSize / 2, oneSquareSize, oneSquareSize)

                    ctx.globalCompositeOperation = "source-over"

                    const fontSize:              number = optimalVerticalIndent / 3
                    const horizontalShapeCenter: number = horizontalCoord + oneSquareSize * 3 / 4
                    const verticalShapeCenter:   number = verticalCoord + oneSquareSize * 3 / 4
                    const currentOptionName:     string = options[ind]

                    ctx.fillStyle = "black";
                    ctx.font      = `bold ${fontSize}px Quicksand`;
                    ctx.fillText(
                        currentOptionName,
                        horizontalShapeCenter - ctx.measureText(currentOptionName).width / 2,
                        verticalShapeCenter + oneSquareSize * 3 / 4 + optimalVerticalIndent / 2
                    );

                    horizontalCoord += optimalHorizontalIndent + squareSize
                    ind++
                }

                verticalCoord += optimalVerticalIndent + squareSize
            }
        }
    }
}
