const fs = require('fs');
// const { body, validationResult } = require('express-validator');
const express = require('express')
const app = express();
const path = require('path');

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

// console.log('object')
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '\\public\\index.html'));
})
app.get('/game', (req, res) => {
	res.sendFile(path.join(__dirname + '\\public\\game.html'));
})
app.post('/createGame', (req, res) => {
	const p1 = req.body.p1;
	const p2 = req.body.p2;
	const ptsToWin = req.body.ptsToWin;
	const servesPerPlayer = req.body.servesPerPlayer;
	const bestOf = req.body.bestOf;
	// console.log({ p1, p2, ptsToWin, servesPerPlayer, bestOf })
	res.redirect(`/game/?P1=${p1}&P2=${p2}&PTW=${ptsToWin}&SP=${servesPerPlayer}&BOf=${bestOf}`);
})

app.listen((port = (process.env.PORT || 3000)), () => {
	console.log(`Example app listening at http://localhost:${port}`)
})