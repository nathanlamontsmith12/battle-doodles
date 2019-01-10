console.log("Doodle Library Linked!");

const doodleLibrary = [
	{
		name: "SNAKE-ISH",
		id: "snake-ish",
		maxHealth: 150,
		strength: 2,
		blockHurt: 4,
		specHit: true,
		setSpecial () {
			const cP = game.players[this.player];
			const cE = game.players[cP.currentEnemy];
			if (cP.batData.lastAttackHit) {
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
		maxHealth: 150,
		strength: 2,
		blockHurt: 2,		
		specHit: false,
		setSpecial () { 
			this.blockMod = 6;
		},
		clearSpecial () { },
		natFacingRight: false,
		src: "images/wily-wisp.png",
		attackAnimation () { },	
	},
	{
		name: "THE BIG NOPE",
		id: "big-nope",
		maxHealth: 150,
		strength: 2,
		blockHurt: 2,
		specHit: false,
		setSpecial () { },
		clearSpecial () { },
		natFacingRight: false,		
		src: "images/big-nope.png",
		attackAnimation () { },				
	},
	{
		name: "TRIANGLE MAN",
		id: "triangle-man",		
		maxHealth: 150,
		strength: 2,
		blockHurt: 2,
		specHit: false,
		setSpecial () { },
		clearSpecial () { },
		natFacingRight: false,		
		src: "images/triangle-man.png",
		attackAnimation () { },				
	},
	{
		name: "PARTICLE MAN",
		id: "particle-man",
		maxHealth: 150,
		strength: 2,
		blockHurt: 2,
		specHit: false,
		setSpecial () { },
		clearSpecial () { },
		natFacingRight: false,
		src: "images/particle-man.png",
		attackAnimation () { },	
	},
	{
		name: "SUAVE BOX",
		id: "suave-box",
		maxHealth: 150,
		strength: 2,
		blockHurt: 2,
		specHit: false,
		setSpecial () { },
		clearSpecial () { },
		natFacingRight: true,
		src: "images/suave-box.png",
		attackAnimation () { },
	},
	{
		name: "PROBLEMATIC DOG",
		id: "problematic-dog",		
		maxHealth: 150,
		strength: 2,
		blockHurt: 2,
		specHit: false,
		setSpecial () { },
		clearSpecial () { },
		natFacingRight: true,		
		src: "images/problematic-dog.png",
		attackAnimation () { },	
	},
	{
		name: "WEDGE BUG",
		id: "wedge-bug",		
		maxHealth: 150,
		strength: 2,
		blockHurt: 2,
		specHit: true,
		setSpecial () { },
		clearSpecial () { },
		natFacingRight: false,		
		src: "images/wedge-bug.png",
		attackAnimation () { },	
	},
	{
		name: "CAT BAT",
		id: "cat-bat",
		maxHealth: 150,
		strength: 2,
		blockHurt: 2,
		specHit: false,
		setSpecial () { },
		clearSpecial () { },
		natFacingRight: true,
		src: "images/cat-bat.png",
		attackAnimation () { },	
	},
	{
		name: "LIL' GUY",
		id: "lil-guy",
		maxHealth: 150,
		strength: 2,
		blockHurt: 2,
		specHit: false,
		setSpecial () { },
		clearSpecial () { },
		natFacingRight: true,
		src: "images/lil-guy.png",
		attackAnimation () { },
	}
]