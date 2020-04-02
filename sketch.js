
// Special thanks to Daniel Shiffman for introducing me to p5.js
var started = false;
let day;					// What day is this? ~ loop
let recoverin;				// How many days to recover?
let x;						// Person starting location
let y;						// Person starting location
let person;					// Person object
let population;				// Array of people
let populationsize;			// length of people array
let pointsofinterest;		// point of initerest object
let pointsofinterestsize;	// Points of interest size
let dead;					// Count dead
let recovered;				// Count recovered
let infected;				// Count infected
let polutionprobability;	// Probability of getting infected
let data;					// Data array


function setup() {

	day = 0;
	dead = 0;
	recovered = 0;
	infected = 1;
	polutionprobability = 20;
	data = [];

	washhands = select("#washhands").elt;
	washhands.onchange = function() {
		if(washhands.checked)
			polutionprobability = 2;
		else
			polutionprobability = 20;
	}

	// How many days to recover?
	recoverin = 140;

	// Dynamic window width
	var cnvdiv = document.getElementById('simulation');
	cnvwidth = cnvdiv.offsetWidth;

	canvasheight = 400;
	x = cnvwidth;
	y = canvasheight;

	var cnv = createCanvas(cnvwidth, canvasheight);
	cnv.parent('simulation');

	background(51);
	noLoop();

}

function draw() {

	// Check if virus spreading ended
	if((recovered + dead) >= infected) {
		createchart(data);
		noLoop();
	}

	// Create chart every 20 days
	if(day%100==0)
		createchart(data);

	data.push({'day': day, 'dead': dead, 'infected': infected, 'recovered': recovered});

	if(started){

		// Background color
		background(51);

		// Show points of interest
		stroke(0, 50, 200);
		strokeWeight(25);
		for (var i = 0; i < pointsofinterestsize; i++)
			pointsofinterest[i].display();

		// Starting loop - day 1
		day++;
		select("#daycount").value(day/10);
		strokeWeight(7);
		for (var i = 0; i < populationsize; i++) {

			// Count days a person is infected
			if(population[i].isinfected)
				population[i].daysinfected++;

			// Recover after 14 days
			if(population[i].daysinfected >= recoverin && population[i].isrecovered!=true) {
				recovered++;
				// infected--;
				select("#recoveredcount").value(recovered);
				population[i].isrecovered = true;
				population[i].isinfected = false;
			}

			population[i].display();
			var newcases = population[i].poluteneighbours(population);
			if(newcases!=false) {
				for (var j = 0; j < newcases.length; j++) {
					population[newcases[j]].isinfected = true;
					infected++;
					select("#infectedcount").value(infected);
				}
			}

			if(population[i].daysinfected > (recoverin/2) && population[i].isrecovered!=true && population[i].vulnerable) {
				dead++;
				population.splice(i,1);
				populationsize -= 1;
				select("#deadcount").value(dead);
			}

		}

	}

}

function start() {

	setup();
	select("#runsimulation").hide();
	select("#deadcount").value(0);
	select("#infectedcount").value(1);
	select("#recoveredcount").value(0);


	started = true;
	populationsize = select("#populationrange").value();
	select("#populationval").html(populationsize);

	pointsofinterestsize = select("#poirange").value();
	select("#poival").html(pointsofinterestsize);

	pointsofinterest = [];
	for (var i = 0; i < pointsofinterestsize; i++) {
		pointofinterest = new PointOfInterest();
		pointsofinterest.push(pointofinterest);
	}

	population = [];
	person = new Person(pointsofinterest);
	person.isinfected = true;
	population.push(person);
	for (var i = 1; i < populationsize; i++) {
		person = new Person(pointsofinterest);
		population.push(person);
	}
	loop();

}

function createchart(data) {

	var day = [];
	var dead = [];
	var infected = [];
	var recovered = [];

	// Only 20 record
	var step = data.length / 20;
	// var step = 1

	for( var i = 0; i < data.length - step; i += step) {

		day.push(data[floor(i)].day / 10);
		dead.push(data[floor(i)].dead);
		infected.push(data[floor(i)].infected - data[floor(i)].recovered - data[floor(i)].dead);
		recovered.push(data[floor(i)].recovered);

	}

	new Chart(document.getElementById("line-chart"), {
		type: 'line',
		data: {
			labels: day,
			datasets: [{ 
					data: dead,
					label: "Dead",
					borderColor: "#3e95cd",
					fill: true
				}, { 
					data: infected,
					label: "Infected",
					borderColor: "#8e5ea2",
					fill: true
				}, { 
					data: recovered,
					label: "Recovered",
					borderColor: "#11cc11",
					fill: true
				}
			]
		},
		options: {
				title: {
				display: true,
				text: 'Simulation graph'
			}
		}
	});

}

class Person {

	// Probability of one starting near (~radius~) a point of radius
	constructor(pointsofinterest) {

		var radius = 50;
		var c = random(100);
		this.vulnerable = false;
		if(c < 70 && pointsofinterest[0]!=undefined) {
			var poi = random(pointsofinterest);
			this.x = random(poi.x - radius, poi.x + radius);
			this.y = random(poi.y - radius, poi.y + radius);
			this.poi = poi;
		} else {
			this.x = random(x);
			this.y = random(y);
			this.poi = false;
		}

		if(c < 4)
			this.vulnerable = true;

		this.isinfected = false;
		this.isdead = false;
		this.isrecovered = false;
		this.daysinfected = 0;

	}

	display() {

		stroke(255, 100);
		if(this.isinfected)
			stroke(200, 0, 20);

		// @TODO:
		if(this.isrecovered)
			stroke(30, 230, 20);

		if(this.isdead)
			stroke(0, 0, 0);

		point(this.x, this.y);
		const r = floor(random(4));

		// Once in a while make bigger steps
		const makeatrip = random(100);
		var step = 4;
		if(makeatrip < 10)
			step = random(30);
		switch (r) {
			case 0:
				this.x = this.x + step;
				break;
			case 1:
				this.x = this.x - step;
				break;
			case 2:
				this.y = this.y + step;
				break;
			case 3:
				this.y = this.y - step;
				break;
		}

		// Give a 1% chance of going back to poi
		if(this.poi!=false) {
			var returntopoi = random(100);
			if(returntopoi < 1) {
				this.x = this.poi.x;
				this.y = this.poi.y;
			}
		}

		// Prevent people going off
		if(this.x <= 0 || this.x >= width)
			this.x = 1;
		if(this.x >= width)
			this.x = width;
		if(this.y <= 0)
			this.y = 1;
		if(this.y >= height)
			this.y = height;

	}

	poluteneighbours(population) {

		var newcases = [];
		if(this.isinfected) {

			// Polution radius
			var radius = 30;
			for (var i = 0; i < population.length; i++) {

				var p = random(100);
				if( p < polutionprobability ) {
					var distance = dist(population[i].x, population[i].y, this.x, this.y);
					if(distance < radius && distance!=0) {
						if(population[i].isinfected!=true && population[i].isrecovered!=true)
							newcases.push(i);
					}
				}

			}

			return newcases;

		} else {

			return false;

		}

	}

}

class PointOfInterest {

	constructor() {
		this.x = random(x);
		this.y = random(y);
	}

	display() {
		point(this.x, this.y);
	}

}