const express = require('express');
const bodyParser = require('body-parser');
const expressApp = express().use(bodyParser.json());

const {dialogflow} = require('actions-on-google');
const app = dialogflow({debug: true});

const port = process.env.PORT || 9000;
const data = require('./data.json');

app.intent('Keyforge Card', (conv, {Card}) => {
    let cardName = Card.toLowerCase();
    let cardInfo = data[cardName];
    let responseString = `Type: ${cardinfo['Type']}.
    House: ${cardinfo['House']}.
    Card Description: ${cardInfo['Card Text']}.
    Aember: ${cardInfo['\u00c6mber']}.`;

    conv.close(responseString);
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