const fs = require('fs');
// const { body, validationResult } = require('express-validator');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const get = (name, extension = 'json') =>
	JSON.parse(fs.readFileSync(`./${name}.${extension}`));
const set = (vari, extension = 'json') => {
	const [name, data] = Object.entries(vari)[0];
	fs.writeFileSync(`./${name}.${extension}`, JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/index.html'));
})
app.get('/game', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/game.html'));
})
app.post('/updateStats', (req, res) => {
	var { pNames, points, games } = req.body;
	if (pNames === undefined) { return console.log("WOAH body is undefined") }

	const log = get('log');
	pNames.forEach((name, pNum) => {
		name = name.toUpperCase().trim();
		if (Object.keys(log).includes(name)) {
			log[name].games += games[pNum];
			log[name].points += points[pNum];
		} else {
			log[name] = {
				"games": games[pNum],
				"points": points[pNum],
			}
		}
	});
	set({ log });
	res.sendStatus(200);
})

app.listen((port = (process.env.PORT || 3000)), () => {
	console.log(`Example app listening at http://localhost:${port}`)
})