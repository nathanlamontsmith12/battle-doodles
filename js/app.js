console.log("DOODLE BATTLE");

// DONE: 
// 1.) display and update player's lives;
// 2.) add game logic to check health / deduct lives / get new doodle 
// 3.) add game logic for game over / rematch 

// --------------

// TO DO: 
// 4.) Make block functionality modular -- and shorten the "block window" 
// 5.) Can't block while attacking (and block reduces damage TO half, rounded down?)
// 6.) Special abilities -- strength + weakness for each 
// 7.) UI -- make it good! 
// 8.) Allow players to set advantage / disadvantage   
// 9.) Players select 2 doodles (1 PL first, 2 PL x2, 1 PL last); no mirror matches (?)
// 10.) At least ten selectable doodles!! 
// 11.) Playtest and balance the doodles 
// 12.) basic animations 
// 13.) basic sound effects 
// 14.) music 
// 15.) complex animations (special attacks?)
// 16.) single-player mode  



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
	erase () {
		const imageToErase = document.querySelector(`#doodle-${this.player} img`);
		document.getElementById("doodle-" + this.player).removeChild(imageToErase);
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
		player1.displayLives();
		player2.displayLives();
	},
	refillDoodleArray () {
		const filler = doodleLibrary.slice();
		filler.forEach((elem) => {
			doodleArray.push(elem);
		})
	}, 
	setDoodles () {
		player1.getDoodle();
		player2.getDoodle();
	},
	drawDoodles() {
		player1.doodle.draw();
		player2.doodle.draw();
	}
}

// Player data 

const player1 = {
	lives: 2,
	block: false,
	doodle: null,
	getDoodle () {
		const randInd1 = Math.floor(Math.random()*doodleArray.length);
		this.doodle = new Doodle ("1", doodleArray[randInd1]);
		doodleArray.splice(randInd1, 1);
		this.displayHealth();
	},
	displayHealth () {
		health1.textContent = this.doodle.health.toString();
	},
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
	displayLives() {
		document.getElementById("player-1-lives").textContent = this.lives.toString();
	},
	displayBlock () {
		block1.style.visibility = "visible";
	},
	doodleKO () {
		this.doodle.erase();
		this.getDoodle();
		this.doodle.draw();
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
		player2.checkHealth();
		player2.checkLives();
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
			}
		}
	}
}

const player2 = {
	lives: 2,
	block: false,
	doodle: null,
	getDoodle () {
		const randInd2 = Math.floor(Math.random()*doodleArray.length);
		this.doodle = new Doodle ("2", doodleArray[randInd2]);
		doodleArray.splice(randInd2, 1);
		this.displayHealth();
	},
	displayHealth () {
		health2.textContent = this.doodle.health.toString();
	},
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
			alert("Player 1 Wins!");
			location.reload(true);
		}
	},
	displayLives () {
		document.getElementById("player-2-lives").textContent = this.lives.toString();
	},
	displayBlock () {
		block2.style.visibility = "visible";
	},
	doodleKO () {
		this.doodle.erase();
		this.getDoodle();
		this.doodle.draw();
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
		player1.checkHealth();
		player1.checkLives();
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