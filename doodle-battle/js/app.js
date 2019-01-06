console.log("DOODLE BATTLE");

const player1 = {
	health: 100,
	displayHealth () {
		health1.textContent = this.health.toString();
	}
}

const player2 = {
	health: 100,
	displayHealth () {
		health2.textContent = this.health.toString();
	}
}


batBData1.activate();
batBData2.activate();
player1.displayHealth();
player2.displayHealth();

document.addEventListener("keypress", (evt) => {

// Battle bar 1: 
	batBData1.keypress(evt);

// Battle bar 2: 
	batBData2.keypress(evt);

})