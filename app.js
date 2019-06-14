'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expressApp = express().use(bodyParser.json());

const {dialogflow, BasicCard, Image,} = require('actions-on-google');
const app = dialogflow({debug: true});

const port = process.env.PORT || 9000;
const data = require('./data.json');

app.intent('Keyforge Card', (conv, {Card}) => {
    let cardName = Card.toLowerCase();
    let cardInfo = data[cardName];
    let responseString = `Type - ${cardInfo['Type']}.  
    House - ${cardInfo['House']}.  
    Card Description - ${cardInfo['Card Text']}  
    Aember - ${cardInfo['\u00c6mber']}.`;

    conv.ask(responseString);
    conv.ask(new BasicCard({
        title: (Card.toUpperCase()),
        image: new Image({
            url: cardInfo['imgSrc'],
            alt: 'cardName'
        }),
    }));
    conv.ask('Would you like to hear about another card?');
});

expressApp.get('/', (req, res) => {
    res.send('We\'re up!');
});

expressApp.get('/cards/:cardName', (req, res) => {
    let cardName = (req.params.cardName).toLowerCase();
    let responseString = {};
    let cardInfo = data[cardName];

    if(cardInfo) {
        responseString = `Type - ${cardInfo['Type']}. 
        House - ${cardInfo['House']}. 
        Card Description - ${cardInfo['Card Text']} 
        Aember - ${cardInfo['\u00c6mber']}.`;
    }

    res.send(responseString);
});

expressApp.get('/cards/', (req, res) => {
    res.json(data);
});

expressApp.post('/fulfillment', app);

expressApp.listen(port, ()=> {
    console.log(`Example app listening on port ${port}!`);
});