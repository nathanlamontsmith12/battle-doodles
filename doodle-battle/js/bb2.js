console.log("Battle Bar 2 Linked");

const canvasBB2 = document.getElementById("battle-bar-2");
const ctxBB2 = canvasBB2.getContext("2d");
const message2 = document.getElementById("message-2");
const health2 = document.getElementById("health-2");

const batBData2 = {
	delayHandle: null,
	delay: 0,
	minDelayHit: 2,
	maxDelayHit: 4,
	minDelayMiss: 4,
	maxDelayMiss: 7,
	lastAttackHit: true,
	active: false,
	canW: canvasBB2.width,
	canH: canvasBB2.height,
	hitW: 20,
	dotR: 7,
	dotMoving: false,
	dotF: true,
	aniHandle: null,
	aniX: 0,
	minSpeed: 5,
	maxSpeed: 8,
	erase () {
		ctxBB2.clearRect(0, 0, this.canW, this.canH);
	},
	setSpeed () {
		attackDot2.speed = this.minSpeed + Math.floor(Math.random()*(this.maxSpeed - this.minSpeed + 2));
	},
	activate () {
		this.delay = 0;
		this.active = true;
		this.aniX = 0;
		attackDot2.x = batBData2.dotR;
		this.setSpeed();
		battleBar2.draw();
		hitBox2.draw();
		attackDot2.draw();
		this.dotMoving = true;
		this.dotF = true;
		animateDot2();
	},
	keypress (evt) {

		if (this.active) {
			if (this.dotMoving) {
				if (evt.key === "j") {
					this.dotMoving = false; 
					stopDot2(); 
					attackDot2.checkHit();
					this.attackDelay();
				}
			}

			if (evt.key === "q") {
				if (this.dotMoving) {
					this.dotMoving = false;
					stopDot2();
				}
			}
		}
	},
	attackDelay () {

		this.active = false;
				
		if (!this.lastAttackHit) {
			this.delay = this.minDelayMiss + Math.floor(Math.random()*(this.maxDelayMiss - this.minDelayMiss));
		} else {
			this.delay = this.minDelayHit + Math.floor(Math.random()*(this.maxDelayHit - this.minDelayHit));
		}

		this.delayHandle = setInterval(()=>{
			if (this.delay > 0) {
				this.delay--;
				attackDot2.eraseDot();
			} else {
				clearInterval(this.delayHandle);
				this.delay = 0;
				this.activate();
			};
		}, 500)
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
	speed: 2,
	draw () {
		ctxBB2.beginPath();
		ctxBB2.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctxBB2.fillStyle = "black";
		ctxBB2.fill();
	},
	eraseDot () {
		batBData2.erase();
		battleBar2.draw();
		hitBox2.draw();
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
		
		batBData2.lastAttackHit = false;

		if (batBData2.dotF) {
			if (this.x + this.r <= rightLim && this.x - this.r >= leftLim) {
				console.log("P2: PERFECT HIT!");
				batBData2.lastAttackHit = true;
			} else if (this.x >= leftLim && this.x <= rightLim) {
				console.log("P2: HIT!");
				batBData2.lastAttackHit = true;
			}
		}
		if (!batBData2.dotF) {
			if (this.x - this.r >= leftLim && this.x + this.r <= rightLim) {
				console.log("P2: PERFECT HIT!");
				batBData2.lastAttackHit = true;
			} else if (this.x >= leftLim && this.x <= rightLim) {
				console.log("P2: HIT!");
				batBData2.lastAttackHit = true;
			}
		}

		if (!batBData2.lastAttackHit) {
			console.log("P2: MISS!");
		}
	}
}



// Animation functions -- start

function animateDot2 () {
	if (batBData2.delay <= 0) {

 		batBData2.delay = 0;

 		clearInterval(batBData2.delayHandle);

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
	}

	batBData2.aniHandle = window.requestAnimationFrame(animateDot2);
}

// Animation functions -- stop

function stopDot2 () {
	cancelAnimationFrame(batBData2.aniHandle);
}

