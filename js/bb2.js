console.log("Battle Bar 2 Linked");

const canvasBB2 = document.getElementById("battle-bar-2");
const ctxBB2 = canvasBB2.getContext("2d");
const message2 = document.getElementById("message-2");
const health2 = document.getElementById("health-2");
const block2 = document.getElementById("block-2");

const batBData2 = {
	damage: 0,
	pHit: false,
	delayHandle: null,
	delay: 0,
	maxDelay: 10,
	delayPenalty: 2,
	minDelayHit: 2,
	maxDelayHit: 4,
	minDelayMiss: 2,
	maxDelayMiss: 6,
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
		this.erase();
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
	applyDelay () {
		console.log("delay penalty player 2")

		if (this.delay > 0) {
			this.delay = this.delay += this.delayPenalty;
			if (this.delay > this.maxDelay) {
				this.delay = this.maxDelay;
			}
		} else {
			
			this.active = false;
			this.dotMoving = false;
			stopDot2();

			this.delay = this.delay + this.delayPenalty;
			if (this.delay > this.maxDelay) {
				this.delay = this.maxDelay;
			}
			this.delayHandle = setInterval(()=>{
				if (this.delay > 0) {
					this.delay--;
					attackDot1.eraseDot();
				} else {
					clearInterval(this.delayHandle);
					this.activate();
				};
			}, 500)
		}
	},
	attackDelay () {

		this.active = false;
				
		if (!this.lastAttackHit) {
			this.delay = this.delay + this.minDelayMiss + Math.floor(Math.random()*(this.maxDelayMiss - this.minDelayMiss));
		} else {
			this.delay = this.delay + this.minDelayHit + Math.floor(Math.random()*(this.maxDelayHit - this.minDelayHit));
		}

		if (this.delay > this.maxDelay) {
			this.delay = this.maxDelay;
		}

		this.delayHandle = setInterval(()=>{
			if (this.delay > 0) {
				this.delay--;
				attackDot2.eraseDot();
			} else {
				clearInterval(this.delayHandle);
				player2.dealDamage();
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
		batBData2.pHit = false;

		if (batBData2.dotF) {
			if (this.x + this.r <= rightLim && this.x - this.r >= leftLim) {
				message2.textContent = "PERFECT HIT!";
				batBData2.lastAttackHit = true;
				batBData2.pHit = true;
				batBData2.damage = (player2.doodle.strength + (this.speed * 2)) * 2;
			} else if (this.x >= leftLim && this.x <= rightLim) {
				message2.textContent = "HIT!";
				batBData2.lastAttackHit = true;
				batBData2.damage = (player2.doodle.strength + (this.speed * 2));
			}
		}
		if (!batBData2.dotF) {
			if (this.x - this.r >= leftLim && this.x + this.r <= rightLim) {
				message2.textContent = "PERFECT HIT!";
				batBData2.lastAttackHit = true;
				batBData2.pHit = true;
				batBData2.damage = (player2.doodle.strength + (this.speed * 2)) * 2;
			} else if (this.x >= leftLim && this.x <= rightLim) {
				message2.textContent = "HIT!";
				batBData2.lastAttackHit = true;
				batBData2.damage = (player2.doodle.strength + (this.speed * 2));
			}
		}

		if (!batBData2.lastAttackHit) {
			message2.textContent = "MISS!";
			batBData2.damage = 0;
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