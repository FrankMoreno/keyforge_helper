const express = require('express');
const app = express();
const port = process.env.PORT || 9000;
const data = require('./data.json');

app.get('/', (req, res) => {
    res.send('We\'re up!');
})
app.get('/cards/:cardName', (req, res) => {
    let cardName = req.params.cardName;
    res.json(data[cardName]);
});

app.get('/cards/', (req, res) => {
    res.json(data);
});

app.listen(port, ()=> {
    console.log(`Example app listening on port ${port}!`);
});