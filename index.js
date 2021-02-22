const fs = require('fs');
const express = require('express')
const app = express();
const path = require('path');
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '\\public\\index.html'));
})

app.listen((port = 3000 || process.env.PORT), () => {
	console.log(`Example app listening at http://localhost:${port}`)
})