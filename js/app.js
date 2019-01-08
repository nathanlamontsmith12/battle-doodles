console.log("DOODLE BATTLE");

// DONE: 
// 1.) display and update player's lives;
// 2.) add game logic to check health / deduct lives / get new doodle 
// 3.) add game logic for game over / rematch 
// 4.) Make block functionality modular -- and shorten the "block window" ? *** 
// 5.) Can't block while attacking (and block reduces damage TO half, rounded down?)

// CHANGE OF PLAN: block reduces damage to half, and cannot block while attacking -- 
// this makes the block window more dynamic and nerfs blocking enough. ---> DONE! 

// CHANGE OF PLAN: The much more elegant solution -- blockHurt! 

// --------------
// CURRENT TASKS: 
//	Selectable;
//	DRY;
// 	Differentiation + special abilities!!  
// --------------

// TO DO: 
// 6.) Special abilities -- strength + weakness for each 
// 7.) Allow players to set advantage / disadvantage   
// 8.) Players select 2 doodles (1 PL first, 2 PL x2, 1 PL last); no mirror matches (?)
// 9.) UI -- make it good! 
// 10.) At least ten selectable doodles!! 
// 11.) Playtest and balance the doodles 
// 12.) basic animations 

// ------------------------

// 13.) basic sound effects 
// 14.) music 
// 15.) complex animations (special attacks?)
// 16.) single-player mode  



// ****** NOTE: "blocking mode" ********* 

const doodleArray = [];

// Class 

class Doodle {
	constructor (player, doodle) {
		this.player = player;
		this.name = doodle.name;
		this.health = doodle.health;
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


// Game data 

const game = {
	playerSelection: 1,
	totLives: 3,
	totPlayers: 0,
	blockAniHandle: null,
	selections: [],
	loadMenu () {
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
	},
	showArena () {
		document.getElementById("arena").style.display = "flex";
	},
	hideArena () {
		document.getElementById("arena").style.display = "none";
	},
	init0 () {
		this.refillDoodleArray();
		this.loadMenu();
	},
	init2 () {
		document.getElementById("s-screen").style.display = "none";
		this.showArena();
		batBData1.activate();
		batBData2.activate();
		this.setDoodles();
		this.drawDoodles();
		this.setLives();
		player1.displayLives();
		player2.displayLives();
		animateBlock();
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
	setLives () {
		player1.lives = this.totLives;
		player2.lives = this.totLives;
	},
	drawDoodles () {
		player1.doodle.draw();
		player2.doodle.draw();
	},
	clearSelections () {
		this.selections = [];
		this.playerSelection = 1;
		player1.startingDoodles = [];
		player2.startingDoodles = [];
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
	}
}


// Player data 


// PLAYER   1



const player1 = {
	lives: 0,
	attacking: false,
	block: false,
	doodle: null,
	startingDoodles: [],
	getDoodle () {
		this.doodle = new Doodle ("1", doodleLibrary[this.startingDoodles[0]]);
		this.startingDoodles.shift();
		this.doodle.setSpecial();
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
	doodleKO () {
		this.doodle.clearSpecial();
		this.doodle.erase();
		this.getDoodle();
		this.doodle.draw();
	},
	attack () {

		if (!batBData1.lastAttackHit) {
			return;
		}
		player2.block = true;
	},
	dealDamage () {
		this.attacking = false;
		player2.block = false;
		player2.doodle.health = player2.doodle.health -= batBData1.damage;
		player2.displayHealth();
		player2.checkHealth();
		player2.checkLives();
	},
	keypress (evt) {

		if (batBData1.active) {
			if (batBData1.dotMoving && !this.attacking) {
				if (evt.key === "a") {
					this.attacking = true;
					batBData1.dotMoving = false; 
					stopDot1(); 
					attackDot1.checkHit();
					this.attack();
					batBData1.attackDelay();
				}
			}
		}
		if (evt.key === "d") {
			if (this.block && !this.attacking) {
				batBData2.damage = Math.floor(batBData2.damage / this.doodle.blockMod); 
				this.block = false;
				return;
			}
			this.doodle.health -= this.doodle.blockHurt;
			this.displayHealth();
			this.checkHealth();
			this.checkLives();
		}
	}
}



// PLAYER   2



const player2 = {
	lives: 0,
	attacking: false,
	block: false,
	doodle: null,
	startingDoodles: [],
	getDoodle () {
		this.doodle = new Doodle ("2", doodleLibrary[this.startingDoodles[0]]);
		this.startingDoodles.shift();
		this.doodle.setSpecial();
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
	doodleKO () {
		this.doodle.clearSpecial();
		this.doodle.erase();
		this.getDoodle();
		this.doodle.draw();
	},
	attack () {

		if (!batBData2.lastAttackHit) {
			return;
		}
		player1.block = true;
	},
	dealDamage () {
		this.attacking = false;
		player1.block = false;
		player1.doodle.health = player1.doodle.health -= batBData2.damage;
		player1.displayHealth();
		player1.checkHealth();
		player1.checkLives();
	},
	keypress (evt) {

		if (batBData2.active) {
			if (batBData2.dotMoving && !this.attacking) {
				if (evt.key === "j") {
					this.attacking = true;
					batBData2.dotMoving = false;
					stopDot2(); 
					attackDot2.checkHit();
					this.attack();
					batBData2.attackDelay();
				}
			}
		}
		if (evt.key === "l") {
			if (this.block && !this.attacking) {
				batBData1.damage = Math.floor(batBData1.damage / this.doodle.blockMod); 
				this.block = false;
				return;
			};
			this.doodle.health -= this.doodle.blockHurt;
			this.displayHealth();
			this.checkHealth();
			this.checkLives();
		}
	}
}

// *** CACHED ELEMENTS *** 

// buttons
const menuDisplayBtn = document.getElementById("doodle-menu-btn");
const rulesDisplayBtn = document.getElementById("rules-btn");
const doodleDescDispBtn = document.getElementById("doodle-descriptions-btn");
const clearSelectionsBtn = document.getElementById("clear-selections-btn");


// displays 
const selectionMenu = document.getElementById("menu");
const rulesDisplay = document.getElementById("rules");
const doodleDescDisplay = document.getElementById("doodle-descriptions");


		// <div id="s-screen-display">
		// 	<div id="menu">
		// 	</div>
		// 	<div id="rules">
		// 	</div>
		// 	<div id="doodle-descriptions">
		// 	</div>
		// </div>
		// <div id="s-screen-button-row">
		// 	<button id="doodle-menu-btn">DOODLE SELECTION</button>
		// 	<button id="rules-btn">RULES</button>
		// 	<button id="doodle-descriptions-btn">DOODLE DESCRIPTIONS</button>
		// 	<button id="clear-selections-btn">CLEAR SELECTIONS</button>
		// </div>



// EVENT LISTENERS 

menuDisplayBtn.addEventListener("click", (evt) => {
	rulesDisplay.style.display = "none";
	doodleDescDisplay.style.display = "none";
	selectionMenu.style.display = "flex";
})

rulesDisplayBtn.addEventListener("click", (evt) => {
	doodleDescDisplay.style.display = "none";
	selectionMenu.style.display = "none";
	rulesDisplay.style.display = "block";
})

doodleDescDispBtn.addEventListener("click", (evt) => {
	rulesDisplay.style.display = "none";
	selectionMenu.style.display = "none";
	doodleDescDisplay.style.display = "block";
})

clearSelectionsBtn.addEventListener("click", () => {
	game.wipeSelections();
})


document.getElementById("menu").addEventListener("click", (evt) => {

	if (evt.target.id === "menu") {
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
		player1.startingDoodles.push(tracker);
	}

	if (game.playerSelection === 2) {
		player2.startingDoodles.push(tracker);
	}

	game.clearSelectionDisplay();

	player1.startingDoodles.forEach( (elem, index) => {
		const location = document.getElementById(`p1-selection-${index + 1}`);
		const picToPlace = document.createElement("IMG");
		picToPlace.src = doodleLibrary[elem].src;
		picToPlace.classList.add("miniSelDisp");
		location.appendChild(picToPlace);
	});

	player2.startingDoodles.forEach( (elem, index) => {
		const location = document.getElementById(`p2-selection-${index + 1}`);
		const picToPlace = document.createElement("IMG");
		picToPlace.src = doodleLibrary[elem].src;
		picToPlace.classList.add("miniSelDisp");
		location.appendChild(picToPlace);
	});

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


document.addEventListener("keypress", (evt) => {

// Battle bar 1: 
	player1.keypress(evt);

// Battle bar 2: 
	player2.keypress(evt);

})



// FUNCTIONS 

game.init0();

function animateBlock () {

	if (player1.block && !player1.attacking) {
		block1.style.visibility = "visible";
	} else {
		block1.style.visibility = "hidden";
	}

	if (player2.block && !player2.attacking) {
		block2.style.visibility = "visible";
	} else {
		block2.style.visibility = "hidden";
	}

	game.blockAniHandle = window.requestAnimationFrame(animateBlock);
}