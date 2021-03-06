console.log("app.js Linked");

const doodleArray = [];

class Doodle {
	constructor (player, doodle) {
		this.player = player;
		this.name = doodle.name;
		this.health = doodle.maxHealth;
		this.maxHealth = doodle.maxHealth;
		this.src = doodle.src;
		this.id = doodle.id;
		this.strength = doodle.strength;
		this.setSpecial = doodle.setSpecial;
		this.clearSpecial = doodle.clearSpecial;
		this.blockHurt = doodle.blockHurt;
		this.specHit = doodle.specHit;
		this.natFacingRight = doodle.natFacingRight;
		this.blockMod = 2;
		this.poisoned = false;
	}
	draw () {
		const image = document.createElement("IMG");
		image.src = this.src;
		image.id = `${this.id}`;
		const location = document.getElementById("doodle-" + this.player.toString());
		location.appendChild(image);
		const imageToFlip = document.getElementById(this.id);
		if (this.natFacingRight === null) {
			return;
		}
		if (!this.natFacingRight && this.player === 1) {
			imageToFlip.classList.add("rotated");
		}
		if (this.natFacingRight && this.player === 2) {
			imageToFlip.classList.add("rotated");		
		}
		document.querySelectorAll(".rotated").forEach( (elem) => {
			if (elem) {
				elem.style.transform = "rotateY(180deg)";
			}
		})
	}
	erase () {
		const imageToErase = document.querySelector(`#doodle-${this.player} img`);
		document.getElementById("doodle-" + this.player).removeChild(imageToErase);
	}
	hitAnimation (incomingDam) {
	
		game.players[this.player].checkHealth();
		
		const thisDoodle = document.querySelector(`#doodle-${this.player}`);

		let jiggle; 

		if (!incomingDam) {
			return;
		}
		jiggle = Math.floor(incomingDam * 1.5);
		
		if (jiggle > 90) {
			jiggle = 90;
		}
		if (this.player === 1) {
			thisDoodle.velocity({ marginRight: jiggle }, { loop: 1, duration: 50 }).velocity({ marginLeft: jiggle }, { loop: 1, duration: 150 });
		} else {
			thisDoodle.velocity({ marginLeft: jiggle }, { loop: 1, duration: 50 }).velocity({ marginRight: jiggle }, { loop: 1, duration: 150 });
		}
	}
	attackAnimation (attDelay) {
		const toAnimate = document.getElementById(`${this.id}`);
		const riseDuration = attDelay - 50;
		toAnimate.velocity({ paddingTop: 0 }, { duration: riseDuration, } ).velocity( { paddingTop: 30 }, { duration: 50 } );
	}
}


class Player {
	constructor (player, attackKey, blockKey) {
		this.player = player;
		this.attackKey = attackKey,
		this.blockKey = blockKey,
		this.currentEnemy = null;
		this.lives = 0;
		this.doodle = null;
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
			lastAttackHit: false,
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
		this.doodle = new Doodle (this.player, doodleLibrary[this.startingDoodles[0]]);
		this.startingDoodles.shift();
		this.checkHealth();
	}
	doodleKO () {
		this.doodle.clearSpecial();
		this.doodle.erase();
		const dPImages = document.querySelectorAll(`#player-${this.player}-s-display .miniSelDisp`);
		dPImages[0].remove();
		if (this.lives > 0) {
			this.getDoodle();
			this.doodle.draw();
			if (!this.doodle.specHit) {
				this.doodle.setSpecial();
			}
		}
	} 
	checkHealth () {
		this.displayHealth();
		if (this.doodle.health <= 0) {
			this.lives--;
			this.displayLives();
			this.doodleKO();
			this.checkLives();
		}
		this.displayHealth();
	}
	checkLives () {
		if (this.lives <= 0) {
			const losingPlMessage = this.player.toString();
			game.losingPlayer = "Player " + losingPlMessage;
			game.checkGameOver();
		}
	}
	displayHealth () {
		this.healthElem.textContent = this.doodle.health.toString();
		let hBarPerc = (100*(this.doodle.health / this.doodle.maxHealth)).toFixed(0);
		hBarPerc = hBarPerc.toString();
		document.getElementById(`p${this.player}-health-remaining`).style.width = `${hBarPerc}%`;
	}
	updateSelectionDisplay () {
		this.startingDoodles.forEach( (elem, index) => {
			const location = document.getElementById(`p${this.player}-selection-${index + 1}`);
			const picToPlace = document.createElement("IMG");
			const doodlePicInd = parseInt(elem);
			picToPlace.src = doodleLibrary[doodlePicInd].src;
			picToPlace.classList.add("miniSelDisp");
			location.appendChild(picToPlace);
		});	
	}
	displayLives() {
		document.getElementById(`player-${this.player}-lives`).textContent = this.lives.toString();
	}
	keypress (evt) {

		if (this.batData.active) {
			if (this.batData.dotMoving && !this.batData.attacking) {
				if (evt.key === this.attackKey) {
					this.batData.attacking = true;
					this.batData.dotMoving = false; 
					battle.inputAttackFrom(this.player);
				}
			}
		}
		if (evt.key === this.blockKey) {
			if (this.batData.block && this.batData.blockFlag && this.batData.beingAttacked && !this.batData.attacking) {
				battle.inputBlockFrom(this.player, true);
			} else {
				battle.inputBlockFrom(this.player, false);
			}
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

		if (game.players[this.player].batData.lastAttackHit) {
			game.players[this.player].doodle.attackAnimation((game.players[this.player].batData.delay)*500); 
		}

		game.players[this.player].batData.delayHandle = setInterval(()=>{
			if (game.players[this.player].batData.delay > 0) {
				game.players[this.player].batData.delay--;
				this.eraseDDot();
			} else {
				clearInterval(game.players[this.player].batData.delayHandle);
				battle.dealDamage(game.players[this.player].batData.damage, this.player, game.players[this.player].currentEnemy); 
				this.reset();
			}
		}, 500);
	}
	checkHit (attackTarget) { 
		const leftLim = this.hitBox.x; 
		const rightLim = this.hitBox.x + this.hitBox.width;
		
		const currentPlayer = game.players[this.player];

		game.players[attackTarget].batData.beingAttacked = true;
		currentPlayer.batData.lastAttackHit = false;
		currentPlayer.batData.pHit = false;

		if (currentPlayer.batData.dotF) {
			if (this.attackDot.x + this.attackDot.r <= rightLim && this.attackDot.x - this.attackDot.r >= leftLim) {
				currentPlayer.messageElem.textContent = "PERFECT HIT!";
				currentPlayer.batData.lastAttackHit = true;
				currentPlayer.batData.pHit = true;
				currentPlayer.batData.damage = (currentPlayer.doodle.strength + (currentPlayer.batData.speed * 2)) * 2;
			} else if (this.attackDot.x >= leftLim && this.attackDot.x <= rightLim) {
				currentPlayer.messageElem.textContent = "HIT!";
				currentPlayer.batData.lastAttackHit = true;
				currentPlayer.batData.damage = (currentPlayer.doodle.strength + (currentPlayer.batData.speed * 2));
			}
		}
		if (!currentPlayer.batData.dotF) {
			if (this.attackDot.x - this.attackDot.r >= leftLim && this.attackDot.x + this.attackDot.r <= rightLim) {
				currentPlayer.messageElem.textContent = "PERFECT HIT!";
				currentPlayer.batData.lastAttackHit = true;
				currentPlayer.batData.pHit = true;
				currentPlayer.batData.damage = (currentPlayer.doodle.strength + (currentPlayer.batData.speed * 2)) * 2;
			} else if (this.attackDot.x >= leftLim && this.attackDot.x <= rightLim) {
				currentPlayer.messageElem.textContent = "HIT!";
				currentPlayer.batData.lastAttackHit = true;
				currentPlayer.batData.damage = (currentPlayer.doodle.strength + (currentPlayer.batData.speed * 2));
			}
		}

		if (!currentPlayer.batData.lastAttackHit) {
			currentPlayer.messageElem.textContent = "MISS!";
			currentPlayer.batData.damage = 0;
			game.players[attackTarget].batData.beingAttacked = false;
		} 

		if (currentPlayer.batData.lastAttackHit && currentPlayer.doodle.specHit) {
			currentPlayer.doodle.setSpecial();
		}
		this.attackDelay();
	}
}


const game = {
	playerSelection: 1,
	totLives: 3,
	totPlayers: 2,
	selections: [],
	losingPlayer: null,
	canHeight: 40,
	canWidth: 200,
	players: [null],
	fearCounter: 0,
	poisonCounter: 0,
	rIntHandle: null,
	pIntHandle: null,
	fIntHandle: null,
	loadMenu () {
		doodleRules.forEach ( (elem) => {
			const paraLocation = document.getElementById("rules-display");
			const newParagraph = document.createElement("DIV");
			newParagraph.textContent = elem;
			paraLocation.appendChild(newParagraph);
		});
		doodleArray.forEach( (elem, index) => {
			const menuItem = document.createElement("DIV"); 
			menuItem.className = "menuItem";
			menuItem.id = `${elem.id}-menu-display`;
			const doodleIMG = document.createElement("IMG");
			doodleIMG.src = elem.src;
			doodleIMG.id = index.toString();
			const doodleName = document.createElement("P");
			doodleName.classList.add("noClick");
			doodleName.textContent = elem.name;
			document.getElementById("menu").appendChild(menuItem);
			menuItem.appendChild(doodleIMG);
			menuItem.appendChild(doodleName);
		});
		for (let i = doodleLibrary.length - 1; i >= 0; i--) {	
			const doodleDescDiv = document.createElement("DIV");
			doodleDescDiv.classList.add("DoodleDescDiv");
			const doodleIcon = document.createElement("IMG");
			doodleIcon.src = doodleLibrary[i].src;
			const doodleDescTextDiv = document.createElement("DIV");
			doodleDescTextDiv.classList.add("DoodleDescText");

			const doodleDesc1 = document.createElement("DIV");
			doodleDesc1.textContent = doodleDescriptions[i].name;
			doodleDescTextDiv.appendChild(doodleDesc1);

			const doodleDesc2 = document.createElement("DIV");
			doodleDesc2.textContent = "HP: " + doodleDescriptions[i].maxHealth;
			doodleDescTextDiv.appendChild(doodleDesc2); 

			const doodleDesc3 = document.createElement("DIV");
			doodleDesc3.textContent = "STRENGTH: " + doodleDescriptions[i].strength;
			doodleDescTextDiv.appendChild(doodleDesc3);

			const doodleDesc4 = document.createElement("DIV");
			doodleDesc4.textContent = "BLOCKHURT: " + doodleDescriptions[i].blockHurt;
			doodleDescTextDiv.appendChild(doodleDesc4); 

			const doodleDesc5 = document.createElement("DIV");
			doodleDesc5.textContent = doodleDescriptions[i].specialName;
			doodleDescTextDiv.appendChild(doodleDesc5); 

			const doodleDesc6 = document.createElement("DIV");
			doodleDesc6.textContent = doodleDescriptions[i].special;
			doodleDescTextDiv.appendChild(doodleDesc6);

			doodleDescDiv.appendChild(doodleIcon);
			doodleDescDiv.appendChild(doodleDescTextDiv);

			doodleDescHome.appendChild(doodleDescDiv);
		}
	},
	showArena () {
		document.getElementById("arena-container").style.display = "flex";
	},
	hideArena () {
		document.getElementById("arena-container").style.display = "none";
	},
	init0 () {
		this.refillDoodleArray();
		this.makePlayers();
		this.loadMenu();
	},
	init1 () {
		// SAVED for possible one-player mode set up
	},
	init2 () {
		document.getElementById("s-screen").style.display = "none";
		this.showArena();
		this.setPlayers();

		for (let i = 1; i <= this.totPlayers; i++) {
			this.setDoodles(i);
			this.drawDoodles(i);
			this.setLives(i);
		}

		this.players.forEach((elem)=>{
			if (elem) {
				if (!elem.doodle.specHit) {
					elem.doodle.setSpecial();
				}
			}
		})

		this.setDoodlePool();
		startAnimation();
	},
	makePlayers () {
		addPlayer(1, "a", "d");
		addPlayer(2, "j", "l");
	},
	refillDoodleArray () {
		const filler = doodleLibrary.slice();
		filler.forEach((elem) => {
			doodleArray.push(elem);
		})
	},
	setDoodles (player) {
		game.players[player].getDoodle();
	},
	setDoodlePool () {
		poolLocation1.appendChild(p1DoodlePool);
		poolLocation2.appendChild(p2DoodlePool);
		const tBR = document.querySelectorAll(".sDisplay p");
		tBR.forEach( (elem) => {
			elem.style.display = "none";
		});
		p1DoodlePool.style.borderStyle = "none";
		p2DoodlePool.style.borderStyle = "none";
	},
	setLives (player) {
		game.players[player].lives = this.totLives;
		game.players[player].displayLives();
	},
	setPlayers () {
		setEnemies();
		setPlayerElements(game.totPlayers);
		setBattleBars(2);

		battle.battleBars[1].setHitBox();
		battle.battleBars[2].setHitBox();

		battle.battleBars[1].setAttackDot();
		battle.battleBars[2].setAttackDot();

		battle.battleBars[1].reset();
		battle.battleBars[2].reset();	
	},
	drawDoodles (player) {
		game.players[player].doodle.draw();
	},
	clearSelections () {
		this.selections = [];
		this.playerSelection = 1;
		game.players.forEach( (elem, player) => {
			if (elem) {
				elem.startingDoodles = [];
			}
		})
	},
	clearSelectionDisplay () {
		const allSelected = document.querySelectorAll(".miniSelDisp");

		for (let m = 0; m < allSelected.length; m++) {
			allSelected[m].remove();
		}
	},
	wipeSelections () {
		this.clearSelections();
		this.clearSelectionDisplay();
		const allImages = document.querySelectorAll(".menuItem img");
		allImages.forEach( (elem) => {
			elem.style.opacity = 1;
		})
	},
	checkGameOver () {
		if (this.losingPlayer) {
			stopAnimation();
			alert(`All of ${this.losingPlayer.toUpperCase()}'s doodles have been KO'ed!`);
			location.reload();
		}
	}
}


const battle = {
	battleBars: [null],
	dealDamage (damage, fromPlayer, toPlayer) {
		game.players[fromPlayer].batData.attacking = false;
		game.players[toPlayer].batData.beingAttacked = false;
		if (game.players[fromPlayer].doodle.specHit) {
			game.players[fromPlayer].doodle.setSpecial();
		}
		if (game.players[toPlayer].batData.blockActive) {
			game.players[toPlayer].doodle.health -= Math.floor(damage / game.players[toPlayer].doodle.blockMod);
			game.players[toPlayer].batData.blockActive = false;
			game.players[toPlayer].doodle.hitAnimation(damage);
		} else {
			game.players[toPlayer].doodle.health -= damage;
			game.players[toPlayer].doodle.hitAnimation(damage);
		}
	},
	inputAttackFrom (player) {
		game.players[player].batData.attacking = true;
		const attackTarget = game.players[player].currentEnemy;
		game.players[attackTarget].batData.block = true;
		this.battleBars[player].checkHit(attackTarget);
	},
	inputBlockFrom (player, goodBlock) {
		currentPlayer = game.players[player];
		if (goodBlock) {
			currentPlayer.batData.blockActive = true;
			currentPlayer.batData.block = false; 
		} else {
			currentPlayer.doodle.health -= currentPlayer.doodle.blockHurt;
			currentPlayer.doodle.hitAnimation(currentPlayer.doodle.blockHurt);
		}
	}
}


// *** CACHED ELEMENTS *** 

// buttons
const menuDisplayBtn = document.getElementById("doodle-menu-btn");
const rulesDisplayBtn = document.getElementById("rules-btn");
const doodleDescDispBtn = document.getElementById("doodle-descriptions-btn");
const clearSelectionsBtn = document.getElementById("clear-selections-btn");


// displays -- starting screen 
const selectionMenu = document.getElementById("menu");
const rulesDisplay = document.getElementById("rules");
const doodleDescDisplay = document.getElementById("doodle-descriptions");
const doodleDescHome = document.getElementById("doodle-description-display");

// displays -- arena screen 
const poolLocation1 = document.getElementById("doodle-pool-player-1");
const poolLocation2 = document.getElementById("doodle-pool-player-2");
const p1DoodlePool = document.getElementById("player-1-s-display");
const p2DoodlePool = document.getElementById("player-2-s-display");




// EVENT LISTENERS 

menuDisplayBtn.addEventListener("click", (evt) => {
	rulesDisplay.style.display = "none";
	doodleDescDisplay.style.display = "none";
	selectionMenu.style.display = "flex";
})

rulesDisplayBtn.addEventListener("click", (evt) => {
	doodleDescDisplay.style.display = "none";
	selectionMenu.style.display = "none";
	rulesDisplay.style.display = "flex";
})

doodleDescDispBtn.addEventListener("click", (evt) => {
	rulesDisplay.style.display = "none";
	selectionMenu.style.display = "none";
	doodleDescDisplay.style.display = "flex";
	window.scrollTo(0, 1500);
})

clearSelectionsBtn.addEventListener("click", () => {
	game.wipeSelections();
})

document.addEventListener("keypress", (evt) => {
	game.players.forEach( (elem) => {
		if (elem) {
			elem.keypress(evt);
		}
	})
})

document.getElementById("menu").addEventListener("click", (evt) => {

	if (evt.target.id === "menu") {
		return;
	}

	if (evt.target.className === "menuItem") {
		return;
	}

	if (evt.target.className === "noClick") {
		return;
	}

	if (game.selections.length >= (game.totLives)*2) {
		game.init2();
		return;
	}

	evt.target.style.opacity = 0.3;

	const tracker = evt.target.id;

	if (game.selections.includes(tracker)) {
		return;
	}

	if (game.playerSelection === 1) {
		game.players[1].startingDoodles.push(tracker);
	}

	if (game.playerSelection === 2) {
		game.players[2].startingDoodles.push(tracker);
	}

	game.clearSelectionDisplay();

	game.players.forEach( (elem, player) => {
		if (elem) {
			elem.updateSelectionDisplay();
		}
	})

	if (game.playerSelection === 1) {
		game.playerSelection = 2;
	} else {
		game.playerSelection = 1;
	}

	game.selections.push(tracker);

	if (game.selections.length >= (game.totLives*2)) {
		game.init2();
	}
})



// *** FUNCTIONS *** 

function setBattleBars (totPlayers) {
	for (let i = 1; i <= totPlayers; i++) {
		const newBattleBar = new BattleBar(i);
		battle.battleBars.push(newBattleBar);
	}
}

function addPlayer (playerNum, attackKey, blockKey) {
		const newPlayer = new Player(playerNum, attackKey, blockKey);
		game.players.push(newPlayer);
}

function setPlayerElements (totPlayers) {
	for (let i = 1; i <= totPlayers; i++) {
		const currentPlayer = game.players[i];
		currentPlayer.canvas = document.getElementById("battle-bar-" + i);
		currentPlayer.ctx = currentPlayer.canvas.getContext("2d");
		currentPlayer.messageElem = document.getElementById("message-" + i);
		currentPlayer.healthElem = document.getElementById("health-" + i);
		currentPlayer.blockElem = document.getElementById("block-" + i);
	}
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

	game.players.forEach( (elem) => {
		if (elem) {
			if (elem.batData.blockFlag && elem.batData.block && elem.batData.beingAttacked && !elem.batData.attacking) {
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

function startAnimation () {
	animateBlock();
	animateDot();
	game.globalAniHandle = window.requestAnimationFrame(startAnimation);
}

function stopAnimation () {
	cancelAnimationFrame(game.globalAniHandle);
}

// Start yer engines....

game.init0();
