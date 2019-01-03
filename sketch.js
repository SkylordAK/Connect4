grid = [[0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0]]
let  scaleX, scaleY;
let player = 1
let gotWinner = false
var winner = ''
let sound1, winner1, winner2;
let woc = 1

function preload() {
	sound1  = loadSound('sounds/block.mp3')
	winner1 = loadSound('sounds/winner1.mp3')
	winner2 = loadSound('sounds/winner2.mp3')
}
function setup() {
	createCanvas(500, 600)
	scaleX = width/grid[0].length
	scaleY = height/grid.length
	for (let i = 0;i < grid[0].length; i++) {
		for (let j = 0;j < grid.length; j++) {
			grid[i][j] = new Game(i*scaleX+scaleX/2, j*scaleY+scaleY/2, scaleX, scaleY)
		}
	}
}

function draw() {
	background(120, 120, 120, 120)
	//console.log(floor(mouseX/scaleX), floor(mouseY/scaleY))
	for (let i = 0;i < grid[0].length; i++) {
		for (let j = 0;j < grid.length; j++) {
			if (mouseIsPressed && !gotWinner) {
				if (!grid[floor(mouseX/scaleX)][floor(mouseY/scaleY)].fixed) player = -1*player
				grid[floor(mouseX/scaleX)][floor(mouseY/scaleY)].fixed = true
			}
			grid[i][j].show()
			if (floor(mouseX/scaleX) == i && floor(mouseY/scaleY) == j) {		
				if (player == 1) {
					if (!grid[i][j].fixed) {
						grid[i][j].col[0] = 0
						grid[i][j].col[1] = 1
					}
				} else if (player == -1) {
					if (!grid[i][j].fixed) {
						grid[i][j].col[0] = 1
						grid[i][j].col[1] = 0
					}
				}
			} else {
				if (!grid[i][j].fixed) {
					grid[i][j].col[0] = 0
					grid[i][j].col[1] = 0
				}
			}
		}
	}
	if (gotWinner) {
		textSize(80)
		background(0)
		stroke(100, 120, 130, 20)
		if (winner == 'Red') {
			fill(255, 0, 0)
		} else if (winner == 'Blue') {
			fill(0, 0, 255)
		}
		playSounds(1, 'play')
		playSounds(2, 'play')
		text(winner+" win's", width/2-scaleX-80, height/2-scaleY+80)
		textSize(30)
		fill(100, 100, 100, 100)
		text('Press SPACE to restart game', width/2-scaleX-105, height/2-scaleY+140)
		for (let i = 0;i < grid[0].length; i++) {
			for (let j = 0;j < grid.length; j++) {
				grid[i][j].reset()
			}
		}
	}
}

function checkWinner(cell, col) {
	right = [false, false, false, true]
	left  = [false, false, false, true]
	up 	  = [false, false, false, true]
	down  = [false, false, false, true]
	rup   = [false, false, false, true]
	rdown = [false, false, false, true]
	lup   = [false, false, false, true]
	ldown = [false, false, false, true]
	//console.log(grid[cell[0+1]][cell[1]])
	for (let i = 1;i < 5; i++) {
		try {if (grid[cell[0]+i][cell[1]].color == col)		right[i-1]  = true //RIGHT
		} catch {NaN}
		try {if (grid[cell[0]-i][cell[1]].color == col) 	left[i-1]   = true //LEFT
		} catch {NaN}
		try {if (grid[cell[0]][cell[1]-i].color == col) 	up[i-1]     = true //UP
		} catch {NaN}	
		try {if (grid[cell[0]][cell[1]+i].color == col) 	down[i-1]   = true //DOWN
		} catch {NaN}
		try {if (grid[cell[0]+i][cell[1]-i].color == col) 	rup[i-1] 	= true //RUP
		} catch {NaN}
		try {if (grid[cell[0]+i][cell[1]+i].color == col) 	rdown[i-1] 	= true //RDOWN
		} catch {NaN}
		try {if (grid[cell[0]-i][cell[1]-i].color == col) 	lup[i-1]	= true //LUP
		} catch {NaN}		
		try {if (grid[cell[0]-i][cell[1]+i].color == col) 	ldown[i-1]  = true //LDOWN
		} catch {NaN}
	}
	if (right.filter(i => i === true).length == 4 || left.filter (i => i === true).length == 4 ||
		up.filter	(i => i === true).length == 4 || down.filter (i => i === true).length == 4 ||
		lup.filter	(i => i === true).length == 4 || ldown.filter(i => i === true).length == 4 ||
		rup.filter	(i => i === true).length == 4 || rdown.filter(i => i === true).length == 4) {
			winner = col
			gotWinner = true
			
	}
}
function Game(x, y, w, h) {
	this.x = x
	this.y = y
	this.w = w
	this.h = h
	this.col = [0, 0]
	this.fixed = false
	this.color = ''
	this.show = function() {
		if (this.fixed) {
			if (this.col[0] == 1) this.color = 'Blue'
			else this.color = 'Red'
		}
		noFill()
		stroke(100, 100, 100, 100)
		if (this.col[1] == 1) fill(255, 0, 0)
		else if (this.col[0] == 1) fill(0, 0, 255)
		ellipse(this.x, this.y, this.w, this.h)
	}
	
	this.reset = function() {
		this.fixed = false
		this.col = [0, 0]
		this.color = ''
	}
}

function playSounds(pick, operation) {
	if (operation == 'play') {
		if (pick == 0) {
			sound1.play()
		} if (pick == 1 && (!winner1.isPlaying()) && woc == 1) {
			winner1.play()
			woc = 2;
		} if (pick == 2 && (!winner2.isPlaying())) {
			winner2.play()
		}
	}
}

function keyPressed() {
	if (key == ' ' && gotWinner) {
		winner = ''
		gotWinner = false
		player = 1
		woc = 1
	}
}
function mouseClicked() {
	checkWinner([floor(mouseX/scaleX), floor(mouseY/scaleY)], grid[floor(mouseX/scaleX)][floor(mouseY/scaleY)].color)
	if (!gotWinner) playSounds(0, 'play')
}
