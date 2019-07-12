'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expressApp = express().use(bodyParser.json());

const {dialogflow, BasicCard, Image, Button} = require('actions-on-google');
const app = dialogflow({debug: true});

const port = process.env.PORT || 9000;
const cardData = require('./resources/cardData.json');
const ruleData = require('./resources/ruleData.json');

const AppContexts = {
    Rule: 'number',
    Card: 'card'
}

app.intent('Card Name', (conv, {Card}) => {
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
    conv.ask('Would you like to hear about another card or a rule?');
});

app.intent('Rule Name', (conv, {Rule}) => {
    let ruleInfo = ruleData[Rule][0];

    conv.ask(ruleInfo);
    if(ruleData[Rule].length > 1) {
        conv.ask(conv.contexts.get(RuleName.RULE.Rule));
        conv.ask('Would you like to hear more about this rule?');
    }
    else{
        conv.ask('Would you like to hear about another rule or a card?');
    }
});

app.intent('Rule Name - yes', (conv) => {
    conv.ask(conv.contexts.get('RuleName-followup'));
    conv.ask('Would you like to hear about another rule or a card?');
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

expressApp.get('/rules/:ruleName', (req, res) => {
    let ruleName = req.params.ruleName;
    let ruleInfo = ruleData[ruleName][0];

    res.send(ruleInfo);
});

expressApp.get('/cards/', (req, res) => {
    res.json(cardData);
});

expressApp.post('/fulfillment', app);

expressApp.listen(port, ()=> {
    console.log(`Example app listening on port ${port}!`);
});