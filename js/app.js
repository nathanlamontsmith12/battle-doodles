console.log("DOODLE BATTLE");

const doodleArray = [];

// Class

class Doodle {
	constructor (player, doodle) {
		this.player = player;
		this.draw = doodle.draw;
		this.setAttr = doodle.setAttr;
	}
	make () {
		this.draw();
		this.setAttr();
	}
}



// Game data 

const game = {
	init2 () {
		this.refillDoodleArray();
		batBData1.activate();
		batBData2.activate();
		player1.clearBlock();
		player2.clearBlock();
		player1.getDoodle();
		player2.getDoodle();
		player1.displayHealth();
		player2.displayHealth();
	},
	refillDoodleArray () {
		const filler = doodleLibrary.slice();
		filler.forEach((elem) => {
			doodleArray.push(elem);
		})
	}
}

// Player data 

const player1 = {
	lives: 3,
	health: 0,
	block: false,
	doodle: null,
	getDoodle () {
		const randInd = Math.floor(Math.random()*doodleArray.length);
		this.doodle = new Doodle ("1", doodleArray[randInd]);
		this.doodle.make();
	},
	displayHealth () {
		health1.textContent = this.health.toString();
	},
	displayBlock () {
		block1.style.visibility = "visible";
	},
	clearBlock () {
		block1.style.visibility = "hidden";
	},
	attack () {
		if (batBData1.pHit) {
			return;
		}
		if (!batBData1.lastAttackHit) {
			return;
		}
		player2.block = true;
		player2.displayBlock();
	},
	dealDamage () {
		player2.clearBlock();
		player2.block = false;
		player2.health = player2.health -= batBData1.damage;
		player2.displayHealth();
	},
	keypress (evt) {

		if (batBData1.active) {
			if (batBData1.dotMoving) {
				if (evt.key === "a") {
					batBData1.dotMoving = false; 
					stopDot1(); 
					attackDot1.checkHit();
					this.attack();
					batBData1.attackDelay();
				}
			}
		}
		if (this.block) {
			if (evt.key === "d") {
				batBData2.damage = 0;
				console.log("Player 1 Blocked the attack!");
			}
		}
	}
}

const player2 = {
	lives: 3,
	health: 0,
	block: false,
	doodle: null,
	getDoodle () {
		const randInd = Math.floor(Math.random()*doodleArray.length);
		this.doodle = new Doodle ("2", doodleArray[randInd]);
		this.doodle.make();
	},
	displayHealth () {
		health2.textContent = this.health.toString();
	},
	displayBlock () {
		block2.style.visibility = "visible";
	},
	clearBlock () {
		block2.style.visibility = "hidden";
	},
	attack () {
		if (batBData2.pHit) {
			return;
		}
		if (!batBData2.lastAttackHit) {
			return;
		}
		player1.block = true;
		player1.displayBlock();
	},
	dealDamage () {
		player1.clearBlock();
		player1.block = false;
		player1.health = player1.health -= batBData2.damage;
		player1.displayHealth();
	},
	keypress (evt) {

		if (batBData2.active) {
			if (batBData2.dotMoving) {
				if (evt.key === "j") {
					batBData2.dotMoving = false; 
					stopDot2(); 
					attackDot2.checkHit();
					this.attack();
					batBData2.attackDelay();
				}
			}
		}
		if (this.block) {
			if (evt.key === "l") {
				batBData1.damage = 0;
				console.log("Player 2 Blocked the attack!");
			}
		}
	}
}

game.init2();

document.addEventListener("keypress", (evt) => {

// Battle bar 1: 
	player1.keypress(evt);

// Battle bar 2: 
	player2.keypress(evt);

})