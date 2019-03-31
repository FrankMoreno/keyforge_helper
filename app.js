const express = require('express');
const bodyParser = require('body-parser');
const expressApp = express().use(bodyParser.json());

const app = dialogflow({debug: true});
const {dialogflow} = require('actions-on-google');

const port = process.env.PORT || 9000;
const data = require('./data.json');

app.intent('Keyforge Card', (conv, {Card}) => {
    conv.close(Card);
});

expressApp.get('/', (req, res) => {
    res.send('We\'re up!');
})
expressApp.get('/cards/:cardName', (req, res) => {
    let cardName = req.params.cardName;
    res.json(data[cardName]);
});

expressApp.get('/cards/', (req, res) => {
    res.json(data);
});

expressApp.post('/fulfillment', app);

expressApp.listen(port, ()=> {
    console.log(`Example app listening on port ${port}!`);
});