'use strict';
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
    let responseString = `Type: ${cardInfo['Type']}. 
    House: ${cardInfo['House']}. 
    Card Description: ${cardInfo['Card Text']} 
    Aember: ${cardInfo['\u00c6mber']}.`;

    conv.ask(responseString + '\nWould you like to know about another card?');
});

expressApp.get('/', (req, res) => {
    res.send('We\'re up!');
})
expressApp.get('/cards/:cardName', (req, res) => {
    let cardName = (req.params.cardName).toLowerCase();
    // res.json(data[cardName]);
    // let cardName = Card.toLowerCase();
    let cardInfo = data[cardName];
    let responseString = `Type: ${cardInfo['Type']}. 
    House: ${cardInfo['House']}. 
    Card Description: ${cardInfo['Card Text']} 
    Aember: ${cardInfo['\u00c6mber']}.`;

    //conv.ask(responseString + `\nWould you like to know about another card?`);
    res.send(responseString);
});

expressApp.get('/cards/', (req, res) => {
    res.json(data);
});

expressApp.post('/fulfillment', app);

expressApp.listen(port, ()=> {
    console.log(`Example app listening on port ${port}!`);
});