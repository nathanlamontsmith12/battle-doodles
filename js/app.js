console.log("DOODLE BATTLE");

const doodleArray = [];

// Class

class Doodle {
	constructor (player, doodle) {
		this.player = player;
		this.name = doodle.name;
		this.health = doodle.health;
		this.src = doodle.src;
	}
	draw () {
		const image = document.createElement("IMG");
		image.src = this.src;
		const location = document.getElementById("doodle-" + this.player);
		location.appendChild(image);
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
		this.setDoodles();
		this.drawDoodles();
		player1.displayHealth();
		player2.displayHealth();
	},
	refillDoodleArray () {
		const filler = doodleLibrary.slice();
		filler.forEach((elem) => {
			doodleArray.push(elem);
		})
	}, 
	setDoodles () {
		const randInd1 = Math.floor(Math.random()*doodleArray.length);
		player1.doodle = new Doodle ("1", doodleArray[randInd1]);
		const randInd2 = Math.floor(Math.random()*doodleArray.length);
		player2.doodle = new Doodle ("2", doodleArray[randInd1]);
	},
	drawDoodles() {
		player1.doodle.draw();
		player2.doodle.draw();
	}
}

// Player data 

const player1 = {
	lives: 3,
	block: false,
	doodle: null,
	displayHealth () {
		health1.textContent = this.doodle.health.toString();
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
		player2.doodle.health = player2.doodle.health -= batBData1.damage;
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
	block: false,
	doodle: null,
	displayHealth () {
		health2.textContent = this.doodle.health.toString();
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
		player1.doodle.health = player1.doodle.health -= batBData2.damage;
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

// CACHED ELEMENTS 



// EVENT LISTENERS 

document.addEventListener("keypress", (evt) => {

// Battle bar 1: 
	player1.keypress(evt);

// Battle bar 2: 
	player2.keypress(evt);

})


game.init2();