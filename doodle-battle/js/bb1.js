console.log("Battle Bar 1 Linked");

const canvasBB1 = document.getElementById("battle-bar-1");
const ctxBB1 = canvasBB1.getContext("2d");

const batBData1 = {
	active: false,
	canW: canvasBB1.width,
	canH: canvasBB1.height,
	hitW: 20,
	dotR: 7,
	dotMoving: false,
	dotF: true,
	aniHandle: null,
	aniX: 0,
	erase () {
		ctxBB1.clearRect(0, 0, this.canW, this.canH);
	},
	setSpeed () {
		const newSpeed = input.value;
		const validInputs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
		if (validInputs.includes(newSpeed)) {
			attackDot1.speed = parseInt(newSpeed);
		} else {
			alert("Please enter valid speed!");
		}
	},
	activate () {
		this.active = true;
		battleBar1.draw();
		hitBox1.draw();
		attackDot1.draw();
	},
	keypress (evt) {
		if (batBData1.active) {
			if (batBData1.dotMoving) {

				if (evt.key === "a") {
					if (batBData1.dotMoving) {
						batBData1.dotMoving = false; // --> comment out to keep dot moving
						stopDot1(); // --> comment out to keep dot moving 
						attackDot1.checkHit();
					}
				}
			}

			if (evt.key === "Enter") {

				if (!batBData1.dotMoving) {
					batBData1.dotMoving = true;
					animateDot1();
				}
			}

			if (evt.key === "q") {
				if (batBData1.dotMoving) {
					batBData1.dotMoving = false;
					stopDot1();
				}
			}
		}
	}
}

const battleBar1 = {
	x: 0,
	y: 0,
	width: batBData1.canW,
	height: batBData1.canH,
	color: "white",
	draw () {
		ctxBB1.beginPath();
		ctxBB1.rect(this.x, this.y, this.width, this.height);
		ctxBB1.fillStyle = this.color;
		ctxBB1.fill();
	}
}

const hitBox1 = {
	x: batBData1.canW/2 - batBData1.hitW/2,
	y: 0, 
	width: batBData1.hitW,
	height: batBData1.canH,
	color: "red",
	draw () {
		ctxBB1.beginPath();
		ctxBB1.rect(this.x, this.y, this.width, this.height);
		ctxBB1.fillStyle = this.color;
		ctxBB1.fill();
	}
}

const attackDot1 = {
	x: batBData1.dotR,
	y: batBData1.canH/2, 
	r: batBData1.dotR,
	speed: 1,
	draw () {
		ctxBB1.beginPath();
		ctxBB1.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctxBB1.fillStyle = "black";
		ctxBB1.fill();
	},
	moveF () {
		this.x += this.speed;
	},
	moveB () {
		this.x -= this.speed;
	},
	animateF () { 
		batBData1.erase();
		battleBar1.draw();
		hitBox1.draw();
		this.moveF();
		this.draw();
	},
	animateB () {
		batBData1.erase();
		battleBar1.draw();
		hitBox1.draw();
		this.moveB();
		this.draw();		
	},
	checkHit () {
		const leftLim = hitBox1.x; 
		const rightLim = hitBox1.x + hitBox1.width;
		
		if (batBData1.dotF) {
			if (this.x + this.r <= rightLim && this.x - this.r >= leftLim) {
				console.log("PERFECT HIT!");
			} else if (this.x >= leftLim && this.x <= rightLim) {
				console.log("HIT!");
			}
		}
		if (!batBData1.dotF) {
			if (this.x - this.r >= leftLim && this.x + this.r <= rightLim) {
				console.log("PERFECT HIT!");
			} else if (this.x >= leftLim && this.x <= rightLim) {
				console.log("HIT!");
			}
		}
	}
}



// Animation functions -- start

function animateDot1 () {

	batBData1.aniX += attackDot1.speed;
	
	if (batBData1.aniX >= (canvasBB1.width - attackDot1.r*2)) {
		
		batBData1.aniX = 0;

		if (batBData1.dotF) {
			batBData1.dotF = false;
		} else {
			batBData1.dotF = true;
		}
	}

	if (batBData1.dotF) {
		attackDot1.animateF();
	}

	if (!batBData1.dotF) {
		attackDot1.animateB();
	}
	
	batBData1.aniHandle = window.requestAnimationFrame(animateDot1);
}

// Animation functions -- stop

function stopDot1 () {
	cancelAnimationFrame(batBData1.aniHandle);
}

