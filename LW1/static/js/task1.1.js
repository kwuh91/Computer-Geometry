"use strict";

function main1() {
	// Retrieve <canvas> element
	const canvas = document.getElementById("mycanvas");
	console.assert(canvas, "Failed to retrieve the <canvas> element");

	// Get the rendering context for 2DCG
	const ctx = canvas.getContext("2d");

	// Set the canvas width and height to fill the whole screen
	canvas.width = window.innerWidth * 0.99;
	canvas.height = window.innerHeight * 0.98;

	const width = canvas.width;
	const height = canvas.height;

	const initialWidthMultiplier = 0.03;

	// set design for the first text
	ctx.fillStyle = "black";
	ctx.font = "bold 30px Quicksand";

	// first text
	ctx.fillText(
		"Holiday Consumer Spending and Celebration Plans",
		width * initialWidthMultiplier,
		height * 0.05
	);

	// set design for the second text
	ctx.font = "25px Quicksand";

	// second text
	ctx.fillText(
		"Percent who would like to receive",
		width * initialWidthMultiplier,
		height * 0.1
	);

	// set design for the row texts
	ctx.font = "20px Quicksand";

	// define array of text for the rows
	const rowNames = [
		"Gift cards & certificates",
		"Clothing & clothing accessories",
		"Books & other media",
		"Home decor & furnishings",
		"Personal care & beauty",
		"Jewelry",
		"Consumer electronics &",
		"Home improvement items &",
		"Sporting goods & leisure items",
		"Other",
	];

	// define center point for the rectangles
	const lineWidth =
		width * (1 - initialWidthMultiplier) - width * initialWidthMultiplier;
	const centerOfLeftSpace = (lineWidth + (1 / 4) * lineWidth) / 2;

	// define array of rectangle widths
	const rectWidth = [
		{
			initialPurpleWidth: centerOfLeftSpace - lineWidth * 0.35, // 1
			endOrangeWidth: centerOfLeftSpace + lineWidth * 0.27,
		},
		{
			initialPurpleWidth: centerOfLeftSpace - lineWidth * 0.3, // 2
			endOrangeWidth: centerOfLeftSpace + lineWidth * 0.26,
		},
		{
			initialPurpleWidth: centerOfLeftSpace - lineWidth * 0.22, // 3
			endOrangeWidth: centerOfLeftSpace + lineWidth * 0.2,
		},
		{
			initialPurpleWidth: centerOfLeftSpace - lineWidth * 0.215, // 4
			endOrangeWidth: centerOfLeftSpace + lineWidth * 0.12,
		},
		{
			initialPurpleWidth: centerOfLeftSpace - lineWidth * 0.215, // 5
			endOrangeWidth: centerOfLeftSpace + lineWidth * 0.07,
		},
		{
			initialPurpleWidth: centerOfLeftSpace - lineWidth * 0.18, // 6
			endOrangeWidth: centerOfLeftSpace + lineWidth * 0.1,
		},
		{
			initialPurpleWidth: centerOfLeftSpace - lineWidth * 0.15, // 7
			endOrangeWidth: centerOfLeftSpace + lineWidth * 0.19,
		},
		{
			initialPurpleWidth: centerOfLeftSpace - lineWidth * 0.12, // 8
			endOrangeWidth: centerOfLeftSpace + lineWidth * 0.13,
		},
		{
			initialPurpleWidth: centerOfLeftSpace - lineWidth * 0.1, // 9
			endOrangeWidth: centerOfLeftSpace + lineWidth * 0.16,
		},
		{
			initialPurpleWidth: centerOfLeftSpace - lineWidth * 0.05, // 10
			endOrangeWidth: centerOfLeftSpace + lineWidth * 0.055,
		},
	];

	// draw percentage
	ctx.fillText("60%", centerOfLeftSpace - lineWidth * 0.36, height * 0.16);

	// draw a 60% line
	ctx.beginPath();
	ctx.moveTo(centerOfLeftSpace - lineWidth * 0.35, height * 0.17);
	ctx.lineTo(centerOfLeftSpace - lineWidth * 0.35, height * 0.18);
	ctx.stroke();

	ctx.fillText("40%", centerOfLeftSpace - lineWidth * 0.26, height * 0.16);

	// draw a 40% line
	ctx.beginPath();
	ctx.moveTo(centerOfLeftSpace - lineWidth * 0.25, height * 0.17);
	ctx.lineTo(centerOfLeftSpace - lineWidth * 0.25, height * 0.18);
	ctx.stroke();

	ctx.fillText("20%", centerOfLeftSpace - lineWidth * 0.16, height * 0.16);

	// draw a 20% line
	ctx.beginPath();
	ctx.moveTo(centerOfLeftSpace - lineWidth * 0.15, height * 0.17);
	ctx.lineTo(centerOfLeftSpace - lineWidth * 0.15, height * 0.18);
	ctx.stroke();

	ctx.fillText("0%", centerOfLeftSpace - lineWidth * 0.005, height * 0.16);

	// draw a 0% line
	ctx.beginPath();
	ctx.moveTo(centerOfLeftSpace, height * 0.17);
	ctx.lineTo(centerOfLeftSpace, height * 0.18);
	ctx.stroke();

	ctx.fillText("20%", centerOfLeftSpace + lineWidth * 0.14, height * 0.16);

	// draw a 20% line
	ctx.beginPath();
	ctx.moveTo(centerOfLeftSpace + lineWidth * 0.15, height * 0.17);
	ctx.lineTo(centerOfLeftSpace + lineWidth * 0.15, height * 0.18);
	ctx.stroke();

	ctx.fillText("40%", centerOfLeftSpace + lineWidth * 0.24, height * 0.16);

	// draw a 40% line
	ctx.beginPath();
	ctx.moveTo(centerOfLeftSpace + lineWidth * 0.25, height * 0.17);
	ctx.lineTo(centerOfLeftSpace + lineWidth * 0.25, height * 0.18);
	ctx.stroke();

	ctx.fillText("60%", centerOfLeftSpace + lineWidth * 0.34, height * 0.16);

	// draw a 60% line
	ctx.beginPath();
	ctx.moveTo(centerOfLeftSpace + lineWidth * 0.35, height * 0.17);
	ctx.lineTo(centerOfLeftSpace + lineWidth * 0.35, height * 0.18);
	ctx.stroke();

	// set of lines
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	let heightMultiplier = 1;
	for (let i = 0; i < 10; i++) {
		// define line heigh
		let lineHeight = height * 0.23 * heightMultiplier;

		// write row text
		ctx.fillText(
			rowNames[i],
			width * initialWidthMultiplier,
			lineHeight - 10
		);

		// draw figures

		// set left figure design
		ctx.fillStyle = "purple";

		// draw a purple figure
		ctx.fillRect(
			rectWidth[i].initialPurpleWidth,
			lineHeight - 25,
			centerOfLeftSpace - rectWidth[i].initialPurpleWidth,
			20
		);

		// set right figure design
		ctx.fillStyle = "orange";

		// draw an orange figure
		ctx.fillRect(
			centerOfLeftSpace,
			lineHeight - 25,
			rectWidth[i].endOrangeWidth - centerOfLeftSpace,
			20
		);

		// set line design
		ctx.fillStyle = "black";

		// draw a line
		ctx.beginPath();
		ctx.moveTo(width * initialWidthMultiplier, lineHeight);
		ctx.lineTo(width * (1 - initialWidthMultiplier), lineHeight);
		ctx.stroke();

		heightMultiplier += 0.25;
	}

	// set text design
	ctx.fillStyle = "purple";
	ctx.font = "30px Quicksand";

	// write 'Women'
	ctx.fillText("Women", centerOfLeftSpace - lineWidth * 0.25, height * 0.87);

	// set text design
	ctx.fillStyle = "orange";
	ctx.font = "30px Quicksand";

	// write 'Women'
	ctx.fillText("Men", centerOfLeftSpace + lineWidth * 0.2, height * 0.87);

	// set text design
	ctx.fillStyle = "black";
	ctx.font = "15px Quicksand";

	// write footer
	ctx.fillText(
		"Source: NEF'S Annual October Holiday Consumer Survey, conducted by Prosper Insights & Analyacs",
		width * initialWidthMultiplier,
		height * 0.95
	);
}
