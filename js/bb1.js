console.log("Battle Bar 1 Linked");

const canvasBB1 = document.getElementById("battle-bar-1");
const ctxBB1 = canvasBB1.getContext("2d");
const message1 = document.getElementById("message-1");
const health1 = document.getElementById("health-1");
const block1 = document.getElementById("block-1");

const batBData1 = {
	damage: 0,
	pHit: false,
	delayHandle: null,
	delay: 0,
	minDelayHit: 2,
	maxDelayHit: 4,
	minDelayMiss: 4,
	maxDelayMiss: 7,
	lastAttackHit: true,
	active: false,
	canW: canvasBB1.width,
	canH: canvasBB1.height,
	hitW: 20,
	dotR: 7,
	dotMoving: false,
	dotF: true,
	aniHandle: null,
	aniX: 0,
	minSpeed: 5,
	maxSpeed: 8,
	erase () {
		ctxBB1.clearRect(0, 0, this.canW, this.canH);
	},
	setSpeed () {
		attackDot1.speed = this.minSpeed + Math.floor(Math.random()*(this.maxSpeed - this.minSpeed + 1));
	},
	activate () {
		this.delay = 0;
		this.active = true;
		this.aniX = 0;
		attackDot1.x = batBData1.dotR;
		this.setSpeed();
		battleBar1.draw();
		hitBox1.draw();
		attackDot1.draw();
		this.dotMoving = true;
		this.dotF = true;
		animateDot1();
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
				attackDot1.eraseDot();
			} else {
				clearInterval(this.delayHandle);
				this.delay = 0;
				player1.dealDamage();
				this.activate();
			};
		}, 500)
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
	eraseDot () {
		batBData1.erase();
		battleBar1.draw();
		hitBox1.draw();
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
		
		batBData1.lastAttackHit = false;
		batBData1.pHit = false;

		if (batBData1.dotF) {
			if (this.x + this.r <= rightLim && this.x - this.r >= leftLim) {
				message1.textContent = "PERFECT HIT!";
				batBData1.lastAttackHit = true;
				batBData1.pHit = true;
				batBData1.damage = this.speed * 2;
			} else if (this.x >= leftLim && this.x <= rightLim) {
				message1.textContent = "HIT!";
				batBData1.lastAttackHit = true;
				batBData1.damage = this.speed * 2;
			}
		}
		if (!batBData1.dotF) {
			if (this.x - this.r >= leftLim && this.x + this.r <= rightLim) {
				message1.textContent = "PERFECT HIT!";
				batBData1.lastAttackHit = true;
				batBData1.pHit = true;
				batBData1.damage = this.speed * 2;
			} else if (this.x >= leftLim && this.x <= rightLim) {
				message1.textContent = "HIT!";
				batBData1.lastAttackHit = true;
				batBData1.damage = this.speed * 2;
			}
		}

		if (!batBData1.lastAttackHit) {
			message1.textContent = "MISS!";
			batBData1.damage = 0;
		}
	}
}



// Animation functions -- start

function animateDot1 () {
	if (batBData1.delay <= 0) {

 		batBData1.delay = 0;

 		clearInterval(batBData1.delayHandle);

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
	}

	batBData1.aniHandle = window.requestAnimationFrame(animateDot1);
}

// Animation functions -- stop

function stopDot1 () {
	cancelAnimationFrame(batBData1.aniHandle);
}

