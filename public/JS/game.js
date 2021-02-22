const pointCounters = document.querySelectorAll('div.points');
const serveBalls = document.querySelectorAll('svg');
const scorecards = document.querySelectorAll('div.scorecard');
const gamesPer = document.querySelectorAll('span.gamesWon');
const names = document.querySelectorAll('div.scorecard span.name');
const winnerBanner = document.querySelector('#winner');
const gameNumber = document.querySelector('span#gameNumber');
const time = document.querySelector('div#time');
class Game {
	constructor(pNames, pointsToWin, servesPer, bestOf) {
		this.pNames = pNames;
		this.ptsToWin = pointsToWin;
		this.servesPer = servesPer;
		this.bestOf = bestOf;
		this.winBy = 2;
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
		if (pNum == null) {
			serveBalls.forEach(el => el.classList.add('hidden'));
		} else {
			serveBalls[pNum].classList.remove('hidden');
			serveBalls[!pNum | 0].classList.add('hidden');
		}
	}
	get server() {
		if (!serveBalls[0].classList.contains('hidden')) { return 0 }
		else if (!serveBalls[1].classList.contains('hidden')) { return 1 }
		else { return null }
	}
	get totalPoints() {
		return this.points[0] + this.points[1];
	}
	get totalGames() {
		return this.games[0] + this.games[1];
	}
	gameFor(pNum) {
		//if won the match
		if (this.games[pNum] == Math.floor(this.bestOf / 2)) {
			this.banner = `${this.pNames[pNum]} Wins The Match in ${this.totalGames + 1} Games!`;
			setTimeout(() => document.location.href = '/', 4000);
			return;
		}
		// they only won the game
		this.banner = `${this.pNames[pNum]} Wins Game #${this.totalGames + 1}!`;

		// reset scores and serve
		this.points = [0, 0];
		pointCounters.forEach(el => el.textContent = 0);
		this.server = null;

		// update games per
		gamesPer[pNum].textContent = this.games[pNum]++ + 1;
		// update game number
		gameNumber.textContent = this.totalGames + 1;


	}
	pointFor(pNum) {
		//	rally for serve
		if (this.points.every(pPts => pPts == 0) && this.server === null) {
			this.server = pNum;
			return;
		}
		// increase local and client values of points (+1 for return value's offset)
		pointCounters[pNum].textContent = this.points[pNum]++ + 1;
		// switch serve
		if (this.totalPames % this.servesPer == 0) {
			this.server = !this.server | 0;
		}
		//win by 2
		if (this.points.every(pPts => pPts + this.winBy - 1 >= this.ptsToWin)) {
			this.ptsToWin++;
		}
		//deadmans
		if (this.points.some(pPts => pPts + 1 == this.ptsToWin)) {
			this.server = !pNum | 0;
		}
		// winner
		if (this.points[pNum] == this.ptsToWin) {
			this.gameFor(pNum);
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
const game = new Game([p1Name, p2Name], pointsToWin, servesPer, bestOf);
scorecards.forEach((el, pNum) => {
	el.onclick = () => {
		game.pointFor(pNum);
	}
});
document.addEventListener('keypress', (event) => {
	if (event.code == 'KeyB') { game.pointFor(0) }
	if (event.code == 'KeyN') { game.pointFor(1) }
});