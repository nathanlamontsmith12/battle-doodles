console.log("DOODLE BATTLE");


batBData1.activate();
batBData2.activate();


document.addEventListener("keypress", (evt) => {

// Battle bar 1: 
	batBData1.keypress(evt);

// Battle bar 2: 
	batBData2.keypress(evt);

})