console.log("Doodle Library Linked!");

const doodleLibrary = [
	{
		name: "SNAKE-ISH",
		id: "snake-ish",
		maxHealth: 100,
		strength: 2,
		blockHurt: 4,
		specHit: true,
		setSpecial () {
			const cP = game.players[this.player];
			const cE = game.players[cP.currentEnemy];
			if (cP.batData.lastAttackHit && !cP.batData.attacking) {
				if (!cE.doodle.poisoned) {
					game.poisonCounter = 5;
					game.pIntHandle = setInterval(()=>{
						if (game.poisonCounter <= 0) {
							clearInterval(game.pIntHandle);
							cE.doodle.poisoned = false;
						}
						if (cE.doodle.poisoned) {
							cE.doodle.health -= 5;
						}
						game.poisonCounter--;
					}, 1500);
					cE.doodle.poisoned = true;
				}
			}
		},
		clearSpecial () { },
		natFacingRight: false,
		src: "images/snake-ish.png",
		attackAnimation () { },		
	},
	{
		name: "WILY WISP", 
		id: "wily-wisp",	
		maxHealth: 100,
		strength: 2,
		blockHurt: 2,		
		specHit: true,
		setSpecial () { 
			const cP = game.players[this.player];
			const cE = game.players[cP.currentEnemy];
			cP.batData.delay = 0;
			cE.batData.damage = 0;
			cE.batData.lastAttackHit = false;
		},
		clearSpecial () { },
		natFacingRight: false,
		src: "images/wily-wisp.png",
		attackAnimation () { },	
	},
	{
		name: "THE BIG NOPE",
		id: "big-nope",
		maxHealth: 120,
		strength: 8,
		blockHurt: 8,
		specHit: false,
		setSpecial () { 
			const cP = game.players[this.player];
			const cEInd = cP.currentEnemy;
			const cE = game.players[cEInd];
			game.fearCounter = 4000;
			game.fIntHandle = setInterval( ()=> {
				game.fearCounter--; 
				battle.battleBars[game.players[this.player].currentEnemy].reset();
				if (game.fearCounter <= 0) {
					clearInterval(game.fIntHandle);
				} 
			}, 1)
		},
		clearSpecial () { 
			clearInterval(game.fIntHandle);
		},
		natFacingRight: false,		
		src: "images/big-nope.png",
		attackAnimation () { },				
	},
	{
		name: "TRIANGLE MAN",
		id: "triangle-man",		
		maxHealth: 80,
		strength: 2,
		blockHurt: 2,
		specHit: false,
		setSpecial () {
			this.blockMod = 6;
		},
		clearSpecial () { },
		natFacingRight: false,		
		src: "images/triangle-man.png",
		attackAnimation () { },				
	},
	{
		name: "PARTICLE MAN",
		id: "particle-man",
		maxHealth: 80,
		strength: 2,
		blockHurt: 2,
		specHit: false,
		setSpecial () { 
			this.blockMod = 1.5;
			game.rIntHandle = setInterval(()=>{
				if (this.health < this.maxHealth) {
					this.health++;
				}
			}, 1000)
		},
		clearSpecial () { 
			clearInterval(game.rIntHandle);
		},
		natFacingRight: false,
		src: "images/particle-man.png",
		attackAnimation () { },	
	},
	{
		name: "SUAVE BOX",
		id: "suave-box",
		maxHealth: 150,
		strength: 8,
		blockHurt: 2,
		specHit: false,
		setSpecial () { 
			const cP = game.players[this.player];
			const cEInd = cP.currentEnemy;
			const cE = game.players[cEInd];
			cE.doodle.health = Math.floor(cE.doodle.health / 2);
		},
		clearSpecial () { 
			const cP = game.players[this.player];
			const cEInd = cP.currentEnemy;
			const cE = game.players[cEInd];
			cE.doodle.health = Math.floor(cE.doodle.health / 2);
		},
		natFacingRight: true,
		src: "images/suave-box.png",
		attackAnimation () { },
	},
	{
		name: "PROBLEMATIC DOG",
		id: "problematic-dog",		
		maxHealth: 100,
		strength: 2,
		blockHurt: 2,
		specHit: true,
		setSpecial () { 
			const cP = game.players[this.player];
			const cE = game.players[cP.currentEnemy];
			let damMod = (this.maxHealth/this.health);
			if (damMod > 3) {
				damMod = 3;
			}
			if (!cP.batData.attacking) {
				if (cP.batData.lastAttackHit) {
					console.log(cP.batData.damage)
					console.log(damMod)
					cP.batData.damage = Math.floor(cP.batData.damage * damMod);
					console.log(cP.batData.damage)
				}
			}
		},
		clearSpecial () { },
		natFacingRight: true,		
		src: "images/problematic-dog.png",
		attackAnimation () { },	
	},
	{
		name: "WEDGE BUG",
		id: "wedge-bug",		
		maxHealth: 100,
		strength: 2,
		blockHurt: 2,
		specHit: true,
		setSpecial () { 
			const cP = game.players[this.player];
			const cE = game.players[cP.currentEnemy];
			if (!cP.batData.attacking) {
				if (cP.batData.lastAttackHit) {
					this.health += Math.floor((cP.batData.damage)/4);
					if (this.health > this.maxHealth) {
						this.health = this.maxHealth;
					}
				}
			}
		},
		clearSpecial () { },
		natFacingRight: false,		
		src: "images/wedge-bug.png",
		attackAnimation () { },	
	},
	{
		name: "CAT BAT",
		id: "cat-bat",
		maxHealth: 100,
		strength: 2,
		blockHurt: 2,
		specHit: true,
		setSpecial () { },
		clearSpecial () { },
		natFacingRight: true,
		src: "images/cat-bat.png",
		attackAnimation () { },	
	},
	{
		name: "LIL' GUY",
		id: "lil-guy",
		maxHealth: 100,
		strength: 2,
		blockHurt: 2,
		specHit: false,
		setSpecial () { 
			const cP = game.players[this.player];
			const cE = game.players[cP.currentEnemy];
			cE.batData.blockFlag = false;
		},
		clearSpecial () { 
			const cP = game.players[this.player];
			const cE = game.players[cP.currentEnemy];
			cE.batData.blockFlag = true;
		},
		natFacingRight: true,
		src: "images/lil-guy.png",
		attackAnimation () { },
	}
]