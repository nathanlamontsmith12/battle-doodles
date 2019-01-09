console.log("Battle Bar 1 Linked");

const canvasBB1 = document.getElementById("battle-bar-1");
const ctxBB1 = canvasBB1.getContext("2d");
const message1 = document.getElementById("message-1");
const health1 = document.getElementById("health-1");
const block1 = document.getElementById("block-1");


class BattleBar {
	constructor (player) {
		this.player = player;
		this.hitBox = {
			x: 0,
			y: 0, 
			width: 0,
			height: 0,
			color: 0,
		};
		this.attackDot = {
			x: 0,
			y: 0,
			r: 0,
		};
	}
	setHitBox () {
		this.hitBox.x = (player1.batData.width/2) - (player1.batData.hitW/2);
		this.hitBox.y = 0; 
		this.hitBox.width = player1.batData.hitW;
		this.hitBox.height = player1.batData.height;
		this.hitBox.color = "red";
	}
	setAttackDot () {
		this.attackDot.x = player1.batData.dotR;
		this.attackDot.y = player1.batData.height/2; 
		this.attackDot.r = player1.batData.dotR;
	}
	drawBBar () {
		ctxBB1.beginPath();
		ctxBB1.rect(player1.batData.x, player1.batData.y, player1.batData.width, player1.batData.height);
		ctxBB1.fillStyle = player1.batData.color;
		ctxBB1.fill();
	}
	drawHBox () {
		ctxBB1.beginPath();
		ctxBB1.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
		ctxBB1.fillStyle = this.hitBox.color;
		ctxBB1.fill();
	}
	drawADot () {
		ctxBB1.beginPath();
		ctxBB1.arc(this.attackDot.x, this.attackDot.y, this.attackDot.r, 0, 2*Math.PI);
		ctxBB1.fillStyle = "black";
		ctxBB1.fill();
	}
	erase () {
		ctxBB1.clearRect(0, 0, player1.batData.width, player1.batData.height);
	}
	eraseDDot () {
		this.erase();
		this.drawBBar();
		this.drawHBox();
	}
	checkDotDirection () {
		if (player1.batData.aniX >= (player1.batData.width - (this.attackDot.r*2))) {	

			player1.batData.aniX = 0;

			if (player1.batData.dotF) {
				player1.batData.dotF = false;
			} else {
				player1.batData.dotF = true;
			}
		}
	}
	moveDot () {
		this.erase();
		this.drawBBar();
		this.drawHBox();
		if (player1.batData.dotF) {
			this.attackDot.x += player1.batData.speed;
		} else {
			this.attackDot.x -= player1.batData.speed;
		}
		this.drawADot();
	}
	setSpeed () {
		const newSpeedMod = Math.floor(Math.random()*(player1.batData.maxSpeed - player1.batData.minSpeed + 1));
		player1.batData.speed = player1.batData.minSpeed + newSpeedMod;
	}
	reset () {
	 	this.erase();
		player1.batData.delay = 0;
		player1.batData.active = true;
		player1.batData.aniX = 0;
		this.attackDot.x = player1.batData.dotR;
		this.setSpeed();
		this.drawBBar();
		this.drawHBox();
		this.drawADot();
		player1.batData.dotMoving = true;
		player1.batData.dotF = true;
	}
	attackDelay () {
		player1.batData.active = false;

		if (!player1.batData.lastAttackHit) {
			player1.batData.delay = player1.batData.delay + player1.batData.minDelayMiss + Math.floor(Math.random()*(player1.batData.maxDelayMiss - player1.batData.minDelayMiss));
		} else {
			player1.batData.delay = player1.batData.delay + player1.batData.minDelayHit + Math.floor(Math.random()*(player1.batData.maxDelayHit - player1.batData.minDelayHit));
		}

		if (player1.batData.delay > player1.batData.maxDelay) {
			player1.batData.delay = player1.batData.maxDelay;
		}

		player1.batData.delayHandle = setInterval(()=>{
			if (player1.batData.delay > 0) {
				player1.batData.delay--;
				this.eraseDDot();
			} else {
				clearInterval(player1.batData.delayHandle);
//				player1.dealDamage();  // NOTE: ****************
				this.reset();
			}
		}, 500);
	}
	checkHit () { 
		const leftLim = this.hitBox.x; 
		const rightLim = this.hitBox.x + this.hitBox.width;
		
		player1.batData.lastAttackHit = false;
		player1.batData.pHit = false;

		if (player1.batData.dotF) {
			if (this.attackDot.x + this.attackDot.r <= rightLim && this.attackDot.x - this.attackDot.r >= leftLim) {
				message1.textContent = "PERFECT HIT!";
				player1.batData.lastAttackHit = true;
				player1.batData.pHit = true;
				player1.batData.damage = (player1.doodle.strength + (player1.batData.speed * 2)) * 2;
			} else if (this.attackDot.x >= leftLim && this.attackDot.x <= rightLim) {
				message1.textContent = "HIT!";
				player1.batData.lastAttackHit = true;
				player1.batData.damage = (player1.doodle.strength + (this.speed * 2));
			}
		}
		if (!player1.batData.dotF) {
			if (this.attackDot.x - this.attackDot.r >= leftLim && this.attackDot.x + this.attackDot.r <= rightLim) {
				message1.textContent = "PERFECT HIT!";
				player1.batData.lastAttackHit = true;
				player1.batData.pHit = true;
				player1.batData.damage = (player1.doodle.strength + (this.speed * 2)) * 2;
			} else if (this.attackDot.x >= leftLim && this.attackDot.x <= rightLim) {
				message1.textContent = "HIT!";
				player1.batData.lastAttackHit = true;
				player1.batData.damage = (player1.doodle.strength + (player1.batData.speed * 2));
			}
		}

		if (!player1.batData.lastAttackHit) {
			message1.textContent = "MISS!";
			player1.batData.damage = 0;
		}
	}
}


const player1 = {
	lives: 0,
	doodle: {
		name: "SNAKE-ISH",
		id: "snake-ish",
		maxHealth: 50,
		strength: 2,
		blockHurt: 2,
		setSpecial () { },
		clearSpecial () { },
		natFacingRight: false,
		src: "images/snake-ish.png",
		attackAnimation () { },		
	},
	startingDoodles: [],
	batData: {
		attacking: false,
		beingAttacked: false,
		blockFlag: true,
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
		width: canvasBB1.width,
		height: canvasBB1.height,
		hitW: 20,
		dotR: 7,
		dotMoving: false,
		dotF: true,
		aniHandle: null,
		aniX: 0,
		minSpeed: 5,
		maxSpeed: 8,
		speed: 1,
		x: 0,
		y: 0,
		color: "white"
	}
}


// const battleBar = {
// 	setHitBox () {
// 		this.hitBox.x = (player1.batData.width/2) - (player1.batData.hitW/2);
// 		this.hitBox.y = 0; 
// 		this.hitBox.width = player1.batData.hitW;
// 		this.hitBox.height = player1.batData.height;
// 		this.hitBox.color = "red";
// 	},
// 	setAttackDot () {
// 		this.attackDot.x = player1.batData.dotR;
// 		this.attackDot.y = player1.batData.height/2; 
// 		this.attackDot.r = player1.batData.dotR;
// 	},
// 	drawBBar () {
// 		ctxBB1.beginPath();
// 		ctxBB1.rect(player1.batData.x, player1.batData.y, player1.batData.width, player1.batData.height);
// 		ctxBB1.fillStyle = player1.batData.color;
// 		ctxBB1.fill();
// 	},
// 	drawHBox () {
// 		ctxBB1.beginPath();
// 		ctxBB1.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
// 		ctxBB1.fillStyle = this.hitBox.color;
// 		ctxBB1.fill();
// 	},
// 	drawADot () {
// 		ctxBB1.beginPath();
// 		ctxBB1.arc(this.attackDot.x, this.attackDot.y, this.attackDot.r, 0, 2*Math.PI);
// 		ctxBB1.fillStyle = "black";
// 		ctxBB1.fill();
// 	},
// 	erase () {
// 		ctxBB1.clearRect(0, 0, player1.batData.width, player1.batData.height);
// 	},
// 	eraseDDot () {
// 		this.erase();
// 		this.drawBBar();
// 		this.drawHBox();
// 	},
// 	checkDotDirection () {
// 		if (player1.batData.aniX >= (player1.batData.width - (this.attackDot.r*2))) {	

// 			player1.batData.aniX = 0;

// 			if (player1.batData.dotF) {
// 				player1.batData.dotF = false;
// 			} else {
// 				player1.batData.dotF = true;
// 			}
// 		}
// 	},
// 	moveDot () {
// 		this.erase();
// 		this.drawBBar();
// 		this.drawHBox();
// 		if (player1.batData.dotF) {
// 			this.attackDot.x += player1.batData.speed;
// 		} else {
// 			this.attackDot.x -= player1.batData.speed;
// 		}
// 		this.drawADot();
// 	},
// 	setSpeed () {
// 		const newSpeedMod = Math.floor(Math.random()*(player1.batData.maxSpeed - player1.batData.minSpeed + 1));
// 		player1.batData.speed = player1.batData.minSpeed + newSpeedMod;
// 	},
// 	reset () {
// 	 	this.erase();
// 		player1.batData.delay = 0;
// 		player1.batData.active = true;
// 		player1.batData.aniX = 0;
// 		this.attackDot.x = player1.batData.dotR;
// 		this.setSpeed();
// 		this.drawBBar();
// 		this.drawHBox();
// 		this.drawADot();
// 		player1.batData.dotMoving = true;
// 		player1.batData.dotF = true;
// 	},
// 	attackDelay () {
// 		player1.batData.active = false;

// 		if (!player1.batData.lastAttackHit) {
// 			player1.batData.delay = player1.batData.delay + player1.batData.minDelayMiss + Math.floor(Math.random()*(player1.batData.maxDelayMiss - player1.batData.minDelayMiss));
// 		} else {
// 			player1.batData.delay = player1.batData.delay + player1.batData.minDelayHit + Math.floor(Math.random()*(player1.batData.maxDelayHit - player1.batData.minDelayHit));
// 		}

// 		if (player1.batData.delay > player1.batData.maxDelay) {
// 			player1.batData.delay = player1.batData.maxDelay;
// 		}

// 		player1.batData.delayHandle = setInterval(()=>{
// 			if (player1.batData.delay > 0) {
// 				player1.batData.delay--;
// 				this.eraseDDot();
// 			} else {
// 				clearInterval(player1.batData.delayHandle);
// //				player1.dealDamage();  // NOTE: ****************
// 				this.reset();
// 			}
// 		}, 500);
// 	},
// 	checkHit () { 
// 		const leftLim = this.hitBox.x; 
// 		const rightLim = this.hitBox.x + this.hitBox.width;
		
// 		player1.batData.lastAttackHit = false;
// 		player1.batData.pHit = false;

// 		if (player1.batData.dotF) {
// 			if (this.attackDot.x + this.attackDot.r <= rightLim && this.attackDot.x - this.attackDot.r >= leftLim) {
// 				message1.textContent = "PERFECT HIT!";
// 				player1.batData.lastAttackHit = true;
// 				player1.batData.pHit = true;
// 				player1.batData.damage = (player1.doodle.strength + (player1.batData.speed * 2)) * 2;
// 			} else if (this.attackDot.x >= leftLim && this.attackDot.x <= rightLim) {
// 				message1.textContent = "HIT!";
// 				player1.batData.lastAttackHit = true;
// 				player1.batData.damage = (player1.doodle.strength + (this.speed * 2));
// 			}
// 		}
// 		if (!player1.batData.dotF) {
// 			if (this.attackDot.x - this.attackDot.r >= leftLim && this.attackDot.x + this.attackDot.r <= rightLim) {
// 				message1.textContent = "PERFECT HIT!";
// 				player1.batData.lastAttackHit = true;
// 				player1.batData.pHit = true;
// 				player1.batData.damage = (player1.doodle.strength + (this.speed * 2)) * 2;
// 			} else if (this.attackDot.x >= leftLim && this.attackDot.x <= rightLim) {
// 				message1.textContent = "HIT!";
// 				player1.batData.lastAttackHit = true;
// 				player1.batData.damage = (player1.doodle.strength + (player1.batData.speed * 2));
// 			}
// 		}

// 		if (!player1.batData.lastAttackHit) {
// 			message1.textContent = "MISS!";
// 			player1.batData.damage = 0;
// 		}
// 	}
// }

const battleBar = new BattleBar (1);


let globalAniHandle = null;

function animateBlock () {
		if (player1.block && !player1.attacking) {
			block1.style.visibility = "visible";
		} else {
			block1.style.visibility = "hidden";
		}

		// if (player2.block && !player2.attacking) {
		// 	block2.style.visibility = "visible";
		// } else {
		// 	block2.style.visibility = "hidden";
		// }
}

function animateDot () {
	if (player1.batData.active) {
		player1.batData.aniX += player1.batData.speed;
		battleBar.checkDotDirection();
		battleBar.moveDot();
	}
}


function startAnimation () {
	animateBlock();
	animateDot();
	globalAniHandle = window.requestAnimationFrame(startAnimation);
}

function stopAnimation () {
	cancelAnimationFrame(animation.globalAniHandle);
}

function attack () {
	battleBar.checkHit();
	battleBar.attackDelay();
}

battleBar.setHitBox();
battleBar.setAttackDot();
battleBar.reset();

startAnimation();


