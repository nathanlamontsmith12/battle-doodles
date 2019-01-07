
class Player {
	constructor (position, lives, difficulty) {
		this.lives = lives;
		this.position = position;
		this.difficulty = difficulty;
	}

}

const player1 = {
	attacking: false,
	block: false,
	doodle: null,
	getDoodle () {
		const randInd = Math.floor(Math.random()*doodleArray.length);
		this.doodle = new Doodle (this.position, doodleArray[randInd]);
		doodleArray.splice(randInd, 1);
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