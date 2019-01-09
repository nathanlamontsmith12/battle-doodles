console.log("Battle Bar 1 Linked");

// const canvasBB1 = document.getElementById("battle-bar-1");
// const ctxBB1 = canvasBB1.getContext("2d");
// const message1 = document.getElementById("message-1");
// const health1 = document.getElementById("health-1");
// const block1 = document.getElementById("block-1");



class Player {
	constructor (player) {
		this.player = player;
		this.lives = 0;
		this.doodle = {
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
		};
		this.startingDoodles = [];
		this.batData = {
			attacking: false,
			beingAttacked: false,
			blockFlag: true,
			block: false,
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
			width: game.canWidth,
			height: game.canHeight,
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
		};
	}
}

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
		this.hitBox.x = (game.players[this.player].batData.width/2) - (game.players[this.player].batData.hitW/2);
		this.hitBox.y = 0; 
		this.hitBox.width = game.players[this.player].batData.hitW;
		this.hitBox.height = game.players[this.player].batData.height;
		this.hitBox.color = "red";
	}
	setAttackDot () {
		this.attackDot.x = game.players[this.player].batData.dotR;
		this.attackDot.y = game.players[this.player].batData.height/2; 
		this.attackDot.r = game.players[this.player].batData.dotR;
	}
	drawBBar () {
		game.players[this.player].ctx.beginPath();
		game.players[this.player].ctx.rect(game.players[this.player].batData.x, game.players[this.player].batData.y, game.players[this.player].batData.width, game.players[this.player].batData.height);
		game.players[this.player].ctx.fillStyle = game.players[this.player].batData.color;
		game.players[this.player].ctx.fill();
	}
	drawHBox () {
		game.players[this.player].ctx.beginPath();
		game.players[this.player].ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
		game.players[this.player].ctx.fillStyle = this.hitBox.color;
		game.players[this.player].ctx.fill();
	}
	drawADot () {
		game.players[this.player].ctx.beginPath();
		game.players[this.player].ctx.arc(this.attackDot.x, this.attackDot.y, this.attackDot.r, 0, 2*Math.PI);
		game.players[this.player].ctx.fillStyle = "black";
		game.players[this.player].ctx.fill();
	}
	erase () {
		game.players[this.player].ctx.clearRect(0, 0, game.players[this.player].batData.width, game.players[this.player].batData.height);
	}
	eraseDDot () {
		this.erase();
		this.drawBBar();
		this.drawHBox();
	}
	checkDotDirection () {
		if (game.players[this.player].batData.aniX >= (game.players[this.player].batData.width - (this.attackDot.r*2))) {	

			game.players[this.player].batData.aniX = 0;

			if (game.players[this.player].batData.dotF) {
				game.players[this.player].batData.dotF = false;
			} else {
				game.players[this.player].batData.dotF = true;
			}
		}
	}
	moveDot () {
		this.erase();
		this.drawBBar();
		this.drawHBox();
		if (game.players[this.player].batData.dotF) {
			this.attackDot.x += game.players[this.player].batData.speed;
		} else {
			this.attackDot.x -= game.players[this.player].batData.speed;
		}
		this.drawADot();
	}
	setSpeed () {
		const newSpeedMod = Math.floor(Math.random()*(game.players[this.player].batData.maxSpeed - game.players[this.player].batData.minSpeed + 1));
		game.players[this.player].batData.speed = game.players[this.player].batData.minSpeed + newSpeedMod;
	}
	reset () {
	 	this.erase();
		game.players[this.player].batData.delay = 0;
		game.players[this.player].batData.active = true;
		game.players[this.player].batData.aniX = 0;
		this.attackDot.x = game.players[this.player].batData.dotR;
		this.setSpeed();
		this.drawBBar();
		this.drawHBox();
		this.drawADot();
		game.players[this.player].batData.dotMoving = true;
		game.players[this.player].batData.dotF = true;
	}
	attackDelay () {
		game.players[this.player].batData.active = false;

		if (!game.players[this.player].batData.lastAttackHit) {
			game.players[this.player].batData.delay = game.players[this.player].batData.delay + game.players[this.player].batData.minDelayMiss + Math.floor(Math.random()*(game.players[this.player].batData.maxDelayMiss - game.players[this.player].batData.minDelayMiss));
		} else {
			game.players[this.player].batData.delay = game.players[this.player].batData.delay + game.players[this.player].batData.minDelayHit + Math.floor(Math.random()*(game.players[this.player].batData.maxDelayHit - game.players[this.player].batData.minDelayHit));
		}

		if (game.players[this.player].batData.delay > game.players[this.player].batData.maxDelay) {
			game.players[this.player].batData.delay = game.players[this.player].batData.maxDelay;
		}

		game.players[this.player].batData.delayHandle = setInterval(()=>{
			if (game.players[this.player].batData.delay > 0) {
				game.players[this.player].batData.delay--;
				this.eraseDDot();
			} else {
				clearInterval(game.players[this.player].batData.delayHandle);
//				game.players[this.player].dealDamage();  // NOTE: ****************
				this.reset();
			}
		}, 500);
	}
	checkHit () { 
		const leftLim = this.hitBox.x; 
		const rightLim = this.hitBox.x + this.hitBox.width;
		
		game.players[this.player].batData.lastAttackHit = false;
		game.players[this.player].batData.pHit = false;

		if (game.players[this.player].batData.dotF) {
			if (this.attackDot.x + this.attackDot.r <= rightLim && this.attackDot.x - this.attackDot.r >= leftLim) {
				game.players[this.player].messageElem.textContent = "PERFECT HIT!";
				game.players[this.player].batData.lastAttackHit = true;
				game.players[this.player].batData.pHit = true;
				game.players[this.player].batData.damage = (game.players[this.player].doodle.strength + (game.players[this.player].batData.speed * 2)) * 2;
			} else if (this.attackDot.x >= leftLim && this.attackDot.x <= rightLim) {
				game.players[this.player].messageElem.textContent = "HIT!";
				game.players[this.player].batData.lastAttackHit = true;
				game.players[this.player].batData.damage = (game.players[this.player].doodle.strength + (this.speed * 2));
			}
		}
		if (!game.players[this.player].batData.dotF) {
			if (this.attackDot.x - this.attackDot.r >= leftLim && this.attackDot.x + this.attackDot.r <= rightLim) {
				game.players[this.player].messageElem.textContent = "PERFECT HIT!";
				game.players[this.player].batData.lastAttackHit = true;
				game.players[this.player].batData.pHit = true;
				game.players[this.player].batData.damage = (game.players[this.player].doodle.strength + (this.speed * 2)) * 2;
			} else if (this.attackDot.x >= leftLim && this.attackDot.x <= rightLim) {
				game.players[this.player].messageElem.textContent = "HIT!";
				game.players[this.player].batData.lastAttackHit = true;
				game.players[this.player].batData.damage = (game.players[this.player].doodle.strength + (game.players[this.player].batData.speed * 2));
			}
		}

		if (!game.players[this.player].batData.lastAttackHit) {
			message1.textContent = "MISS!";
			game.players[this.player].batData.damage = 0;
		}
	}
}


const game = {
	canHeight: 40,
	canWidth: 200,
	totPlayers: 0,
	players: [null],
	checkBlock () {
		this.players.forEach( (elem)=> {
			if (elem) {
				if (!elem.batData.attacking && elem.batData.beingAttacked) {
					elem.batData.block = true;
				} else {
					elem.batData.block = false;
				}
			}
		})
	}
}


const battleBars = [null];

let globalAniHandle = null;



function setBattleBars (totPlayers) {
	for (let i = 1; i <= totPlayers; i++) {
		const newBattleBar = new BattleBar(i);
		battleBars.push(newBattleBar);
	}
}



function setPlayerElements () {
	game.players.forEach( (elem, player) =>{ 
		if (elem) {
			elem.canvas = document.getElementById("battle-bar-" + player);
			elem.ctx = elem.canvas.getContext("2d");
			elem.messageElem = document.getElementById("message-" + player);
			elem.healthElem = document.getElementById("health-" + player);
			elem.blockElem = document.getElementById("block-" + player);
		}
	})
}


function setPlayers (totPlayers) {
	for (let i = 1; i <= totPlayers; i++) {
		const newPlayer = new Player(i);
		game.players.push(newPlayer);
	}
}

function animateBlock () {

	game.checkBlock();

	game.players.forEach( (elem) => {
		if (elem) {
			if (elem.batData.block) {
				elem.blockElem.style.visibility = "visible";
			} else {
				elem.blockElem.style.visibility = "hidden";
			}
		}
	})

	// if (game.players[1].batData.block) {
	// 	block1.style.visibility = "visible";
	// } else {
	// 	block1.style.visibility = "hidden";
	// }

	// if (game.players[2].batData.block) {
	// 	block2.style.visibility = "visible";
	// } else {
	// 	block2.style.visibility = "hidden";
	// }
}

function animateDot () {
	battleBars.forEach( (elem, player) => {
		if (elem) {
			if (game.players[player].batData.active) {
				game.players[player].batData.aniX += game.players[player].batData.speed;
				elem.checkDotDirection();
				elem.moveDot();
			}
		}
	})
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
	battleBars[1].checkHit();
	battleBars[1].attackDelay();
}

function getAttacked () {
	game.players[1].beingAttacked = true;
}

setPlayers(1);
setPlayerElements();
setBattleBars(1);

battleBars[1].setHitBox();
battleBars[1].setAttackDot();
battleBars[1].reset();

startAnimation();
