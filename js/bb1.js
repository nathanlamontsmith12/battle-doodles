console.log("Battle Bar 1 Linked");

// const canvasBB1 = document.getElementById("battle-bar-1");
// const ctxBB1 = canvasBB1.getContext("2d");
// const message1 = document.getElementById("message-1");
// const health1 = document.getElementById("health-1");
// const block1 = document.getElementById("block-1");


class Doodle {
	constructor (player, doodle) {
		this.player = player;
		this.name = doodle.name;
		this.health = doodle.maxHealth;
		this.maxHealth = doodle.maxHealth;
		this.src = doodle.src;
		this.strength = doodle.strength;
		this.setSpecial = doodle.setSpecial;
		this.clearSpecial = doodle.clearSpecial;
		this.blockHurt = doodle.blockHurt;
		this.attackAnimation = doodle.attackAnimation; 
		this.blockMod = 2;
	}
	draw () {
		const image = document.createElement("IMG");
		image.src = this.src;
		const location = document.getElementById("doodle-" + this.player.toString());
		location.appendChild(image);
	}
	erase () {
		const imageToErase = document.querySelector(`#doodle-${this.player} img`);
		document.getElementById("doodle-" + this.player).removeChild(imageToErase);
	}
	hitAnimation () {
		// when doodle takes damage, jiggle-shock the display based on the amount of damage taken 
	}
}


class Player {
	constructor (player, attackKey, blockKey) {
		this.player = player;
		this.attackKey = attackKey,
		this.blockKey = blockKey,
		this.currentEnemy = null;
		this.lives = 0;
		this.doodle = {};
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
	getDoodle () {
		this.doodle = new Doodle (this.player.toString(), doodleLibrary[this.startingDoodles[0]]);
		this.startingDoodles.shift();
		this.doodle.setSpecial();
//		this.displayHealth();
	}
	doodleKO () {
		this.doodle.clearSpecial();
		this.doodle.erase();
		// const dPImages = document.querySelectorAll("#player-1-s-display .miniSelDisp");
		// dPImages[0].remove();
		this.getDoodle();
		this.doodle.draw();
	}
	keypress (evt) {

		if (this.batData.active) {
			if (this.batData.dotMoving && !this.batData.attacking) {
				if (evt.key === this.attackKey) {
					this.batData.attacking = true;
					this.batData.dotMoving = false; 
					battle.battleBars[this.player].checkHit();
					battle.inputAttackFrom(this.player);
					battle.battleBars[this.player].attackDelay();
				}
			}
		}
		if (evt.key === this.blockKey) {
			if (this.batData.block && this.batData.blockFlag) {
				battle.inputBlockFrom(this.player, true);
				this.batData.block = false;
				return;
			}
			battle.inputBlockFrom(this.player, false);
		}
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
				battle.dealDamage(this.player); 
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
			game.players[this.player].messageElem.textContent = "MISS!";
			game.players[this.player].batData.damage = 0;
		}
	}
}


const game = {
	playerSelection: 1,
	totLives: 3,
	totPlayers: 1,
	selections: [],
	canHeight: 40,
	canWidth: 200,
	totPlayers: 0,
	players: [null],
	checkBlock () {
		this.players.forEach( (elem)=> {
			if (elem) {
				if (!elem.batData.attacking && elem.batData.beingAttacked && elem.batData.blockFlag) {
					elem.batData.block = true;
				} else {
					elem.batData.block = false;
				}
			}
		})
	}
}


const battle = {
	battleBars: [null],
	checkHealth () {
		if (this.doodle.health <= 0) {
			this.lives--;
			this.displayLives();
			if (this.lives > 0) {
				this.doodleKO();
			}
		}
	},
	checkLives () {
		if (this.lives <= 0) {
			alert("Player 2 Wins!");
			location.reload();
		}
	},
	dealDamage () {
		// this.attacking = false;
		// player2.block = false;
		// player2.doodle.health = player2.doodle.health -= batBData1.damage;
		// player2.displayHealth();
		// player2.checkHealth();
		// player2.checkLives();
	},
	inputAttackFrom (player) {
		console.log("Attack from Player " + player + "against Player " + game.players[player].currentEnemy.toString());
	},
	inputBlockFrom (player, goodBlock) {
		if (goodBlock) {
			console.log("Good block from Player " + player);
		} else {
			console.log("Bad block from Player " + player);
		}
	}
}

const display = {
	// health () {
	// 	health1.textContent = this.doodle.health.toString();
	// 	let hBarPerc = (100*(this.doodle.health / this.doodle.maxHealth)).toFixed(0);
	// 	hBarPerc = hBarPerc.toString();
	// 	document.getElementById("p1-health-remaining").style.width = `${hBarPerc}%`;
	// },
	// selectionDisplay () {
	// 	this.startingDoodles.forEach( (elem, index) => {
	// 		const location = document.getElementById(`p1-selection-${index + 1}`);
	// 		const picToPlace = document.createElement("IMG");
	// 		const doodlePicInd = parseInt(elem);
	// 		picToPlace.src = doodleLibrary[doodlePicInd].src;
	// 		picToPlace.classList.add("miniSelDisp");
	// 		location.appendChild(picToPlace);
	// 	});	
	// },
	// displayLives() {
	// 	document.getElementById("player-1-lives").textContent = this.lives.toString();
	// },
}


function setBattleBars (totPlayers) {
	for (let i = 1; i <= totPlayers; i++) {
		const newBattleBar = new BattleBar(i);
		battle.battleBars.push(newBattleBar);
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


function setPlayer (playerNum, attackKey, blockKey) {
		const newPlayer = new Player(playerNum, attackKey, blockKey);
		game.players.push(newPlayer);
}

function setEnemies () {
	game.players.forEach( (elem, player)=> {
		if (elem) {
			if (player === 1) {
				elem.currentEnemy = 2;
			}
			if (player === 2) {
				elem.currentEnemy = 1;
			}
		}
	})
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
}

function animateDot () {
	battle.battleBars.forEach( (elem, player) => {
		if (elem) {
			if (game.players[player].batData.active) {
				game.players[player].batData.aniX += game.players[player].batData.speed;
				elem.checkDotDirection();
				elem.moveDot();
			}
		}
	})
}


function init () {
	setPlayer(1, "a", "d");
	setEnemies();
	setPlayerElements();
	setBattleBars(1);

	battle.battleBars[1].setHitBox();
	battle.battleBars[1].setAttackDot();
	battle.battleBars[1].reset();
}


function startAnimation () {
	animateBlock();
	animateDot();
	game.globalAniHandle = window.requestAnimationFrame(startAnimation);
}

function stopAnimation () {
	cancelAnimationFrame(animation.globalAniHandle);
}




function attack () {
	battle.battleBars[1].checkHit();
	battle.battleBars[1].attackDelay();
}

function getAttacked () {
	game.players[1].beingAttacked = true;
}

init();


document.addEventListener("keypress", (evt) => {
	game.players.forEach( (elem) => {
		if (elem) {
			elem.keypress(evt);
		}
	})
})