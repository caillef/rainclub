var random_seed;
const random = function () {
	var x = Math.sin(random_seed) * 10000;
	random_seed = x;
	return x - Math.floor(x);
}

const sound_cash = new Audio('assets/cash.mp3');
const color = [
	"url(assets/carre/plantes.png)",
	"url(assets/carre/machine.png)",
	"url(assets/carre/portable.png)",
	"url(assets/carre/vinyl.png)",
	"url(assets/carre/cactus.png)",
	"url(assets/carre/gameboy.png)",
	"url(assets/carre/roue.png)",
	"url(assets/carre/tele.png)",
	"url(assets/carre/radio.png)"
];
const START_DOLLARS = 450000;

const generate_list = function (nb) {
	var list = [];
	const date = new Date();
	random_seed = date.getHours() + Math.floor(date.getMinutes() / 10);
	for (var i = 0; i < nb; i++) {
		list.push(Math.floor(random() * color.length));
	}
	console.log(list);
	return list;
}

var player, list, cycle, locked, dollars, move, click, cron;

const start_round = function (id) {
	player = id;
	// Show to first player the color
	if (id == 0) {
		setTimeout(() => document.getElementById("action").style["background-image"] = color[list[cycle]], 1500);
	}
	run_clock();
}

const click_square = function (id) {
	if (dollars <= 0) {
		return;
	}
	if (player === undefined) {
		start_round(id);
		return;
	}
	if (locked === undefined) {
		locked = id;
	}
	// if player clicks on locked money
	if (id === locked) {
		// click = 1 -> 33% of money, click = 2 -> 66% of money, click = 3 -> ALL IN
		click += 1;
		if (click == 3) {
			move = dollars;
		}
		// remove money from dollars and update square
		update_dollars(dollars - move);
		update_square(id, click);
	}
};

const update_square = function (id, click) {
	const elem = document.getElementById("a" + (id));
	// elem.style.width = (8 + click) + "vw";
	// elem.style.height = (8 + click) + "vw";
	// elem.style.margin = (click / 3) + "vw";
	const billets = document.getElementById("b" + (id));
	billets.className = "argent" + click;
}

const dollar_to_str = function (dollars) {
	return dollars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " $";
}

var bankerout = false;

const show_bankrupt = function () {
	if (bankerout == false) {
		$(".bankerout").animate({
			top: '0px',
		});

		$(".bankerout article").delay(100).animate({
			top: '25vw',
		});
	}
	bankerout = true;
};

const update_dollars = function (amount) {
	dollars = Math.floor(amount);
	if (dollars <= 0) {
		dollars = 0;
		if (click == 0) {
			show_bankrupt();
		}
	}
	document.getElementById("dollars").innerHTML = dollar_to_str(dollars) + (dollars == 0 && click == 0 ? " BANKRUPT" : "");
	document.getElementById("dollars2").innerHTML = dollar_to_str(dollars) + (dollars == 0 && click == 0 ? " BANKRUPT" : "");
}

const get_out = function() {
	clearInterval(cron);	
}

const play_cycle = function () {
	if (locked === undefined) {
		update_dollars(dollars - (50000 + dollars * 0.33));
	} else {
		// Add dollars
		if (locked == list[cycle]) {
			document.getElementById("retour_fond").style["background-color"] = "#F7D969";
			setTimeout(() => document.getElementById("retour_fond").style["background-color"] = "#99B898", 300);
			update_dollars(dollars + (move * click) * Math.floor(random() * 8 + 2));
			sound_cash.play();
		} else {
			document.getElementById("retour_fond").style["background-color"] = "#F05053";
			setTimeout(() => document.getElementById("retour_fond").style["background-color"] = "#99B898", 300);
		}
		move = 0.33 * dollars;
	}
}

const cron_clock = function () {
	play_cycle();
	reset_cycle();
	cycle++;
	if (dollars <= 0) {
		clearInterval(cron);
		update_dollars(0);
	} else {
		document.getElementById("action").style["background-image"] = (cycle % 6 == player ? color[list[cycle]] : "url(assets/carre/fond.png)");
	}
}

const reset_cycle = function () {
	locked = undefined;
	click = 0;
	for (var i = 0; i < 9; i++) {
		// document.getElementById("a" + i).style.width = "13vw";
		// document.getElementById("a" + i).style.height = "13vw";
		// document.getElementById("a" + i).style.margin = "0.3vw";
		const billets = document.getElementById("b" + (i));
		billets.className = "";
	}
}

const run_clock = function () {
	cron = window.setInterval(cron_clock, 5000);
}

const configure_game = function () {
	player = undefined;
	list = generate_list(1000);
	cycle = 0;
	locked = undefined;
	setTimeout(() => update_dollars(START_DOLLARS), 1000);
	move = START_DOLLARS / 3;
	click = 0;
	cron = undefined;
}
configure_game();