const express = require('express');
const app = express();
const port = 9000;
const data = require('./data.json');

app.get('/cards/:cardName', (req, res) => {
    let cardName = req.params.cardName;
    res.json(data[cardName]);
});

app.listen(port, ()=> {
    console.log(`Example app listening on port ${port}!`);
});