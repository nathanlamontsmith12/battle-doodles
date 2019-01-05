console.log("BATTLE SYSTEM");


const canvas = document.getElementById("battle-bar");
const ctx = canvas.getContext("2d");
const input = document.querySelector("input");

const data = {
	canW: canvas.width,
	canH: canvas.height,
	hitW: 20,
	dotR: 7,
	dotMoving: false,
	dotF: true,
	aniHandle: null,
	aniX: 0,
	erase () {
		ctx.clearRect(0, 0, this.canW, this.canH);
	},
	setSpeed () {
		const newSpeed = input.value;
		const validInputs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
		if (validInputs.includes(newSpeed)) {
			attackDot.speed = parseInt(newSpeed);
		} else {
			alert("Please enter valid speed!");
		}
	}
}

const battleBar = {
	x: 0,
	y: 0,
	width: data.canW,
	height: data.canH,
	color: "white",
	draw () {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

const hitBox = {
	x: data.canW/2 - data.hitW/2,
	y: 0, 
	width: data.hitW,
	height: data.canH,
	color: "red",
	draw () {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

const attackDot = {
	x: data.dotR,
	y: data.canH/2, 
	r: data.dotR,
	speed: 1,
	draw () {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctx.fillStyle = "black";
		ctx.fill();
	},
	moveF () {
		this.x += this.speed;
	},
	moveB () {
		this.x -= this.speed;
	},
	animateF () { 
		data.erase();
		battleBar.draw();
		hitBox.draw();
		this.moveF();
		this.draw();
	},
	animateB () {
		data.erase();
		battleBar.draw();
		hitBox.draw();
		this.moveB();
		this.draw();		
	},
	checkHit () {
		const leftLim = hitBox.x; 
		const rightLim = hitBox.x + hitBox.width;
		
		if (data.dotF) {
			if (this.x + this.r <= rightLim && this.x - this.r >= leftLim) {
				console.log("PERFECT HIT!");
			} else if (this.x >= leftLim && this.x <= rightLim) {
				console.log("HIT!");
			}
		}
		if (!data.dotF) {
			if (this.x - this.r >= leftLim && this.x + this.r <= rightLim) {
				console.log("PERFECT HIT!");
			} else if (this.x >= leftLim && this.x <= rightLim) {
				console.log("HIT!");
			}
		}
	}
}

// DRAW INITIAL STATE 

battleBar.draw();
hitBox.draw();
attackDot.draw();



// Animation functions -- start

function animateDot () {

	data.aniX += attackDot.speed;
	
	if (data.aniX >= (canvas.width - attackDot.r*2)) {
		
		data.aniX = 0;

		if (data.dotF) {
			data.dotF = false;
		} else {
			data.dotF = true;
		}
	}

	if (data.dotF) {
		attackDot.animateF();
	}

	if (!data.dotF) {
		attackDot.animateB();
	}
	
	data.aniHandle = window.requestAnimationFrame(animateDot);
}

// Animation functions -- stop

function stopDot () {
	cancelAnimationFrame(data.aniHandle);
}



document.addEventListener("keypress", (evt) => {
	if (data.dotMoving) {

		if (evt.key === "j") {
			if (data.dotMoving) {
				data.dotMoving = false; // --> comment out to keep dot moving
				stopDot(); // --> comment out to keep dot moving 
				attackDot.checkHit();
			}
		}
	}

	if (evt.key === "Enter") {

		if (!data.dotMoving) {
			data.dotMoving = true;
			animateDot();
		}
	}

	if (evt.key === "q") {
		if (data.dotMoving) {
			data.dotMoving = false;
			stopDot();
		}
	}
})

document.getElementById("set-speed").addEventListener("click", (evt) => {
	data.setSpeed();
})

