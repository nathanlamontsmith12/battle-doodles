console.log("Battle Bar 2 linked");

const canvasBB2 = document.getElementById("battle-bar-2");
const ctxBB2 = canvasBB2.getContext("2d");

const batBData2 = {
	active: false,
	canW: canvasBB2.width,
	canH: canvasBB2.height,
	hitW: 20,
	dotR: 7,
	dotMoving: false,
	dotF: true,
	aniHandle: null,
	aniX: 0,
	erase () {
		ctxBB2.clearRect(0, 0, this.canW, this.canH);
	},
	setSpeed () {
		// NEED TO WRITE NEW CODE HERE [identical to BB1]
	},
	activate () {
		this.active = true;
		battleBar2.draw();
		hitBox2.draw();
		attackDot2.draw();
	},
	keypress (evt) {
		if (batBData2.active) {
			if (batBData2.dotMoving) {

				if (evt.key === "j") {
					if (batBData2.dotMoving) {
						batBData2.dotMoving = false; // --> comment out to keep dot moving
						stopDot2(); // --> comment out to keep dot moving 
						attackDot2.checkHit();
					}
				}
			}

			if (evt.key === "Enter") {

				if (!batBData2.dotMoving) {
					batBData2.dotMoving = true;
					animateDot2();
				}
			}

			if (evt.key === "q") {
				if (batBData2.dotMoving) {
					batBData2.dotMoving = false;
					stopDot2();
				}
			}
		}
	}
}

const battleBar2 = {
	x: 0,
	y: 0,
	width: batBData2.canW,
	height: batBData2.canH,
	color: "white",
	draw () {
		ctxBB2.beginPath();
		ctxBB2.rect(this.x, this.y, this.width, this.height);
		ctxBB2.fillStyle = this.color;
		ctxBB2.fill();
	}
}

const hitBox2 = {
	x: batBData2.canW/2 - batBData2.hitW/2,
	y: 0, 
	width: batBData2.hitW,
	height: batBData2.canH,
	color: "red",
	draw () {
		ctxBB2.beginPath();
		ctxBB2.rect(this.x, this.y, this.width, this.height);
		ctxBB2.fillStyle = this.color;
		ctxBB2.fill();
	}
}

const attackDot2 = {
	x: batBData2.dotR,
	y: batBData2.canH/2, 
	r: batBData2.dotR,
	speed: 1,
	draw () {
		ctxBB2.beginPath();
		ctxBB2.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctxBB2.fillStyle = "black";
		ctxBB2.fill();
	},
	moveF () {
		this.x += this.speed;
	},
	moveB () {
		this.x -= this.speed;
	},
	animateF () { 
		batBData2.erase();
		battleBar2.draw();
		hitBox2.draw();
		this.moveF();
		this.draw();
	},
	animateB () {
		batBData2.erase();
		battleBar2.draw();
		hitBox2.draw();
		this.moveB();
		this.draw();		
	},
	checkHit () {
		const leftLim = hitBox2.x; 
		const rightLim = hitBox2.x + hitBox2.width;
		
		if (batBData2.dotF) {
			if (this.x + this.r <= rightLim && this.x - this.r >= leftLim) {
				console.log("PERFECT HIT!");
			} else if (this.x >= leftLim && this.x <= rightLim) {
				console.log("HIT!");
			}
		}
		if (!batBData2.dotF) {
			if (this.x - this.r >= leftLim && this.x + this.r <= rightLim) {
				console.log("PERFECT HIT!");
			} else if (this.x >= leftLim && this.x <= rightLim) {
				console.log("HIT!");
			}
		}
	}
}



// Animation functions -- start

function animateDot2 () {

	batBData2.aniX += attackDot2.speed;
	
	if (batBData2.aniX >= (canvasBB2.width - attackDot2.r*2)) {
		
		batBData2.aniX = 0;

		if (batBData2.dotF) {
			batBData2.dotF = false;
		} else {
			batBData2.dotF = true;
		}
	}

	if (batBData2.dotF) {
		attackDot2.animateF();
	}

	if (!batBData2.dotF) {
		attackDot2.animateB();
	}
	
	batBData2.aniHandle = window.requestAnimationFrame(animateDot2);
}

// Animation functions -- stop

function stopDot2 () {
	cancelAnimationFrame(batBData2.aniHandle);
}