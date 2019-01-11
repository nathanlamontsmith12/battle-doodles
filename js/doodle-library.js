console.log("Doodle Library Linked!");

const doodleLibrary = [
	{
		name: "SNAKE-ISH",
		id: "snake-ish",
		maxHealth: 120,
		strength: 4,
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
							cE.doodle.hitAnimation(5);
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
		maxHealth: 80,
		strength: 2,
		blockHurt: 4,		
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
		maxHealth: 100,
		strength: 6,
		blockHurt: 10,
		specHit: false,
		setSpecial () { 
			const cP = game.players[this.player];
			const cEInd = cP.currentEnemy;
			const cE = game.players[cEInd];
			game.fearCounter = 3000;
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
			this.blockMod = 4;
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
		blockHurt: 8,
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
		maxHealth: 120,
		strength: 6,
		blockHurt: 6,
		specHit: false,
		setSpecial () { 
			const cP = game.players[this.player];
			const cE = game.players[cP.currentEnemy];
			const bigDam = Math.floor(cE.doodle.health / 2);
			cE.doodle.health -= bigDam;
			cE.doodle.hitAnimation(bigDam);
		},
		clearSpecial () { 
			const cP = game.players[this.player];
			const cE = game.players[cP.currentEnemy];
			const bigDam = Math.floor(cE.doodle.health / 2);
			cE.doodle.health -= bigDam;
			cE.doodle.hitAnimation(bigDam);
		},
		natFacingRight: true,
		src: "images/suave-box.png",
		attackAnimation () { },
	},
	{
		name: "PROBLEMATIC DOG",
		id: "problematic-dog",		
		maxHealth: 120,
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
		maxHealth: 80,
		strength: 4,
		blockHurt: 4,
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
		name: "CAT-BAT",
		id: "cat-bat",
		maxHealth: 60,
		strength: 2,
		blockHurt: 2,
		specHit: false,
		setSpecial () { 
			const cP = game.players[this.player];
			const cE = game.players[cP.currentEnemy];

			cE.batData.minDelayHit = cE.batData.minDelayHit * 2;
			cE.batData.maxDelayHit = cE.batData.maxDelayHit * 2;
			cE.batData.minDelayMiss = cE.batData.minDelayMiss * 3;
			cE.batData.maxDelayMiss = cE.batData.maxDelayMiss * 3; 

		},
		clearSpecial () { 
			const cP = game.players[this.player];
			const cE = game.players[cP.currentEnemy];

			cE.batData.minDelayHit = cE.batData.minDelayHit / 2;
			cE.batData.maxDelayHit = cE.batData.maxDelayHit / 2;
			cE.batData.minDelayMiss = cE.batData.minDelayMiss / 3;
			cE.batData.maxDelayMiss = cE.batData.maxDelayMiss / 3; 
		},
		natFacingRight: true,
		src: "images/cat-bat.png",
		attackAnimation () { },	
	},
	{
		name: "LIL' GUY",
		id: "lil-guy",
		maxHealth: 100,
		strength: 2,
		blockHurt: 6,
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

const doodleDescriptions = [
	{
		name: "SNAKE-ISH",
		maxHealth: "120",
		strength: "4",
		blockHurt: "4",
		specialName: "OBLIGATORY POISON ABILITY",
		special: "A successful attack causes your opponent to lose health over time, for a time... You know the drill",
	},
	{
		name: "WILY WISP",
		maxHealth: "80",
		strength: "2",
		blockHurt: "4",
		specialName: "A TOUCH OF CONFUSION",
		special: "A successful attack disorients your opponent, canceling any incoming attacks against you",
	},
	{
		name: "THE BIG NOPE",
		maxHealth: "100",
		strength: "6",
		blockHurt: "10",
		specialName: "Y-'BTHUL NRON Y-LW'NAHRL",
		special: "On deployment, your opponent will freeze in terror... until they remember this is just a game",
	},
	{
		name: "TRIANGLE MAN",
		maxHealth: "80",
		strength: "2",
		blockHurt: "2",
		specialName: "PYTHAGOREAN DEFENSES",
		special: "Superior blocking, the triangle way",
	},
	{
		name: "PARTICLE MAN",
		maxHealth: "80",
		strength: "2",
		blockHurt: "8",
		specialName: "OTHERWORLD ANATOMY",
		special: "Regains lost health over time, up to its max health, but is worse than average at blocking",
	},
	{
		name: "SUAVE BOX",
		maxHealth: "120",
		strength: "6",
		blockHurt: "6",
		specialName: "THE OL' ONE-TWO",
		special: "On deployment, cut your opponent's current health in half — and do it again if/when SUAVE BOX is KO'ed",
	},
	{
		name: "PROBLEMATIC DOG",
		maxHealth: "120",
		strength: "2",
		blockHurt: "2",
		specialName: "MAN'S WORST ENEMY",
		special: "Does extra damage, scaling up as its life goes down",
	},
	{
		name: "WEDGE BUG",
		maxHealth: "80",
		strength: "4",
		blockHurt: "4",
		specialName: "INKSUCKER",
		special: "This gross doodle devours life-giving ink from the wounds of its enemy",
	},
	{
		name: "CAT-BAT",
		maxHealth: "60",
		strength: "2",
		blockHurt: "2",
		specialName: "CAT-BAT-LIKE REFLEXES",
		special: "Hard to pin down, this doodle increases the delay between your opponent's attacks",
	},
	{
		name: "LIL' GUY",
		maxHealth: "100",
		strength: "2",
		blockHurt: "6",
		specialName: "SNEAK ATTACK",
		special: "Attacks from this doodle cannot be blocked",
	}
]

const doodleRules = [""];
