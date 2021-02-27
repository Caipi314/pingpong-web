const pointCounters = document.querySelectorAll('div.points');
const scorecards = document.querySelectorAll('div.scorecard');
const gamesPer = document.querySelectorAll('span.gamesWon');
const names = document.querySelectorAll('div.scorecard span.name');
const serveBall = document.querySelector('svg#indicator');
const winnerBanner = document.querySelector('#winner');
const gameNumber = document.querySelector('span#gameNumber');
const time = document.querySelector('div#time');
class Game {
	constructor(p1Name, p2Name, pointsToWin, servesPer, bestOf) {
		this.pNames = [p1Name, p2Name];
		this.ptsToWin = this.ogPtsToWin = pointsToWin;
		this.servesPer = servesPer;
		this.bestOf = bestOf;
		this.winBy = 2;
		this.firstServer = null;
		this.gameStart = new Date();

		this.games = [0, 0];
		this.points = [0, 0];

		this.server = null;
		pointCounters.forEach(el => el.textContent = 0);
		setInterval(this.updateTime, 200, this.gameStart);
		names.forEach((el, pNum) => el.textContent = this.pNames[pNum]);
	}
	updateTime(date) {
		const secElaps = Math.floor((new Date() - date) / 1000);
		const minutes = Math.floor(secElaps / 60) % 60;
		const seconds = secElaps % 60;
		time.textContent = `${minutes}:${seconds > 9 ? '' : '0'}${seconds}`;
	}
	set banner(text) {
		winnerBanner.textContent = text;
		winnerBanner.classList.remove('hidden');
		setTimeout(() => winnerBanner.classList.add('hidden'), 4000);
	}
	set server(pNum) {
		serveBall.setAttribute('class', (pNum === null ? '' : `p${pNum + 1}`));
	}
	get server() {
		if (serveBall.getAttribute('class') == 'p1') { return 0 }
		else if (serveBall.getAttribute('class') == 'p2') { return 1 }
		return null;
	}
	get totalPoints() {
		return this.points[0] + this.points[1];
	}
	get totalGames() {
		return this.games[0] + this.games[1];
	}
	matchFor(pNum) {
		this.banner = `${this.pNames[pNum]} Wins The Match in ${this.totalGames + 1} Games!`;
		// setTimeout(() => document.location.href = '/', 4000);

		// update stats
		var xhr = new XMLHttpRequest();
		xhr.open("POST", '/updateStats');
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify({
			'pNames': this.pNames,
			'points': this.points,
			'games': this.games,
		}));
	}
	gameFor(pNum) {
		//if won the match
		if (this.games[pNum] == Math.floor(this.bestOf / 2) + 1) {
			this.matchFor(pNum);
			return;
		}
		// they only won the game

		this.banner = `${this.pNames[pNum]} Wins Game #${this.totalGames + 1}!`;

		// reset scores, serve, ptsToWin
		this.points = [0, 0];
		pointCounters.forEach(el => el.textContent = 0);
		this.server = null;
		this.ptsToWin = this.ogPtsToWin;

		// update games per
		gamesPer[pNum].textContent = this.games[pNum]++ + 1;
		// update game number
		gameNumber.textContent = this.totalGames + 1;
	}
	pointFor(pNum) {
		//	rally for serve
		if (this.points.every(pPts => pPts == 0) && this.server === null) {
			this.firstServer = this.server = pNum;
			return;
		}
		// increase local and client values of points (+1 for return value's offset)
		pointCounters[pNum].textContent = this.points[pNum]++ + 1;
		// switch serve
		// if (this.totalPoints % this.servesPer == 0) {
		// 	this.server = !this.server | 0;
		// }
		if (this.totalPoints % (this.servesPer * 2) == 0) {
			this.server = this.firstServer;
		} else if (this.totalPoints % this.servesPer == 0) {
			this.server = !this.firstServer | 0
		}
		//win by 2
		if (this.points.every(pPts => pPts + this.winBy - 1 >= this.ptsToWin)) {
			this.ptsToWin++;
		}
		//deadmans
		if (this.points.some(pPts => pPts + 1 == this.ptsToWin)) {
			this.server = this.points.indexOf(Math.min(...this.points));
		}
		// winner
		if (this.points[pNum] == this.ptsToWin) {
			this.gameFor(pNum);
		}
	}
	pointRemove(pNum) {
		if (this.points[pNum] - 1 < 0) { return }
		pointCounters[pNum].textContent = this.points[pNum] -= 1;

		// server
		if (this.totalPoints % (this.servesPer * 2) == 0) {
			this.server = this.firstServer;
		} else {
			this.server = !this.firstServer | 0;
		}

		//deadmans
		if (this.points.some(pPts => pPts + 1 == this.ptsToWin)) {
			this.server = this.points.indexOf(Math.min(...this.points));
		}
	}
}
const url_string = window.location.href;
const url = new URL(url_string);
const p1Name = url.searchParams.get("P1");
const p2Name = url.searchParams.get("P2");
const pointsToWin = parseInt(url.searchParams.get("PTW"));
const servesPer = parseInt(url.searchParams.get("SP"));
const bestOf = parseInt(url.searchParams.get("BOf"));
// ?P1=cai&P2=test&PTW=11&SP=2&BOf=3
const game = new Game(p1Name, p2Name, pointsToWin, servesPer, bestOf);


pressed = [];
ready = true;
function ifDouble(event) {
	return new Promise((resolve, reject) => {
		pressed.push(event.code);
		setTimeout(() => {
			pressed.shift();
			if (!ready) { return }
			pressed.includes(event.code) ? resolve(event) : reject(event);
			ready = false;
			setTimeout(() => ready = true, 500);
		}, 500);
	})
}

scorecards.forEach((el, pNum) => {
	el.onclick = () => {
		game.pointFor(pNum)
	}
})
document.addEventListener('keypress', event => {
	console.log(event)
	ifDouble(event)
		.then(event => {
			console.log('doube')
			if (event.code == 'KeyB') { game.pointRemove(0) }
			if (event.code == 'KeyN') { game.pointRemove(1) }
		})
		.catch(event => {
			console.log('single')
			if (event.code == 'KeyB') { game.pointFor(0) }
			if (event.code == 'KeyN') { game.pointFor(1) }
		})
});