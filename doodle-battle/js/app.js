console.log("DOODLE BATTLE");

const player1 = {
	health: 100,
	block: false,
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
	health: 100,
	block: false,
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


batBData1.activate();
batBData2.activate();
player1.clearBlock();
player2.clearBlock();
player1.displayHealth();
player2.displayHealth();

document.addEventListener("keypress", (evt) => {

// Battle bar 1: 
	player1.keypress(evt);

// Battle bar 2: 
	player2.keypress(evt);

})