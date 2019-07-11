'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expressApp = express().use(bodyParser.json());

const {dialogflow, BasicCard, Image, Button} = require('actions-on-google');
const app = dialogflow({debug: true});

const port = process.env.PORT || 9000;
const cardData = require('./resources/cardData.json');

app.intent('Keyforge Card', (conv, {Card}) => {
    let cardName = Card.toLowerCase();
    let cardInfo = cardData[cardName];
    let responseString = `Type - ${cardInfo['Type']}.\nHouse - ${cardInfo['House']}.\nCard Description - ${cardInfo['Card Text']}\nAember - ${cardInfo['\u00c6mber']}.`;

    conv.ask(responseString);
    conv.ask(new BasicCard({
        title: (Card.toUpperCase()),
        image: new Image({
            url: cardInfo['imgSrc'],
            alt: 'cardName'
        }),
        buttons: new Button({
            title: 'Keyforge Compendium',
            url: cardInfo['cardLink']
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
    let cardInfo = cardData[cardName];

    if(cardInfo) {
        responseString = `Type - ${cardInfo['Type']}. 
        House - ${cardInfo['House']}. 
        Card Description - ${cardInfo['Card Text']} 
        Aember - ${cardInfo['\u00c6mber']}.`;
    }

    res.send(responseString);
});

expressApp.get('/cards/', (req, res) => {
    res.json(cardData);
});

expressApp.post('/fulfillment', app);

expressApp.listen(port, ()=> {
    console.log(`Example app listening on port ${port}!`);
});