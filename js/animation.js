





const animation = {
	globalAniHandle: null,
	animateBlock () {
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
	},
	animateBar () {

		if (batBData1.active) {
			batBData1.aniX += attackDot1.speed;
			
			if (batBData1.aniX >= (canvasBB1.width - attackDot1.r*2)) {
				
				batBData1.aniX = 0;

				if (batBData1.dotF) {
					batBData1.dotF = false;
				} else {
					batBData1.dotF = true;
				}
			}

			if (batBData1.dotF) {
				attackDot1.animateF();
			}

			if (!batBData1.dotF) {
				attackDot1.animateB();
			}
		}

		if (batBData2.active) {
			batBData2.aniX += attackDot2.speed;

			if (batBData2.aniX >= (canvasBB2.width - attackDot2.r*2)) {
				
				batBData2.aniX = 0;

				if (batBData2.dotF) {
					batBData2.dotF = false;
				} else {
					batBData2.dotF = true;
				}
			}

			if (batBData2.dotF) {
				attackDot2.animateF();
			}

			if (!batBData2.dotF) {
				attackDot2.animateB();
			}
		}
	}
}

function startAnimation () {
	animation.animateBlock();
	animation.animateBar();
	animation.globalAniHandle = window.requestAnimationFrame(startAnimation);
}

function stopAnimation () {
	cancelAnimationFrame(animation.globalAniHandle);
}