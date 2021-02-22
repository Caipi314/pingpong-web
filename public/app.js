const pointCounters = document.querySelectorAll('div.points');
const serveBalls = document.querySelectorAll('svg');
const scorecards = document.querySelectorAll('div.scorecard');
const gamesPer = document.querySelectorAll('span.gamesWon');
const winnerBanner = document.querySelector('#winner');
const gameNumber = document.querySelector('span#gameNumber');
const time = document.querySelector('div#time');
//todo time clock
class Game {
	constructor(bestOf, servesPer, pointsToWin) {
		this.bestOf = bestOf;
		this.servesPer = servesPer;
		this.ptsToWin = pointsToWin;
		this.winBy = 2;
		this.gameStart = new Date();

		this.games = [0, 0];
		this.points = [0, 0];

		this.server = null;
		pointCounters.forEach(el => el.textContent = '0');
		setInterval(this.updateTime, 200, this.gameStart);
	}
	updateTime(date) {
		const secElaps = Math.floor((new Date() - date) / 1000);
		const minutes = Math.floor(secElaps / 60) % 60;
		const seconds = secElaps % 60;
		time.textContent = `${minutes}:${seconds > 9 ? '' : '0'}${seconds}`;
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
	matchFor(pNum) {
		winnerBanner.textContent = `Player ${pNum + 1} Has Won the Match!`;
		winnerBanner.classList.remove('hidden');
		setTimeout(() => winnerBanner.classList.add('hidden'), 5000);


	}
	gameFor(pNum) {
		winnerBanner.textContent = `Player ${pNum + 1} Wins!`;
		winnerBanner.classList.remove('hidden');
		setTimeout(() => winnerBanner.classList.add('hidden'), 4000);

		// reset scores and serve
		this.points = [0, 0];
		pointCounters.forEach(el => el.textContent = 0);
		this.server = null;

		// increase local and client values of games (+2 for return value's offset)
		gamesPer[pNum].textContent = this.games[pNum]++ + 1;

		gameNumber.textContent = this.games[0] + this.games[1] + 1;

		//if won the match
		if (this.games.some(gamesWon => gamesWon == Math.ceil(this.bestOf / 2))) {
			matchFor(this.games.indexOf(Math.max(...this.games)));
		}
	}
	pointFor(pNum) {
		// console.log(this.server)
		//	rally for serve
		if (this.points.every(pPts => pPts == 0) && this.server === null) {
			return this.server = pNum;
		}
		// increase local and client values of points (+1 for return value's offset)
		pointCounters[pNum].textContent = this.points[pNum]++ + 1;
		// switch serve
		if ((this.points[0] + this.points[1]) % this.servesPer == 0) {
			this.server = !this.server | 0;
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
		if (this.points.some(pPts => pPts == this.ptsToWin)) {
			this.gameFor(this.points.indexOf(Math.max(...this.points)));
		}
	}
}
const game = new Game(3, 2, 11);

scorecards.forEach((el, pNum) => {
	el.onclick = () => {
		game.pointFor(pNum);
	}
});
document.addEventListener('keypress', (event) => {
	if (event.code == 'KeyB') { game.pointFor(0) }
	if (event.code == 'KeyN') { game.pointFor(1) }
});