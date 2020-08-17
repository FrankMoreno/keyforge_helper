const express = require('express');
const bodyParser = require('body-parser');

const expressApp = express().use(bodyParser.json());

const {
  dialogflow, BasicCard, Image, Button,
} = require('actions-on-google');

const app = dialogflow({ debug: true });

const port = process.env.PORT || 9000;
const cardData = require('./resources/cardData.json');
const ruleData = require('./resources/ruleData.json');

app.intent('Card Name', (conv, { Card }) => {
  const cardName = Card.toLowerCase();
  const cardInfo = cardData[cardName];
  const responseString = `Type - ${cardInfo.Type}.\nHouse - ${cardInfo.House}.\nCard Description - ${cardInfo['Card Text']}\nAember - ${cardInfo['\u00c6mber']}.`;

  conv.ask(responseString);
  conv.ask(new BasicCard({
    title: (Card.toUpperCase()),
    image: new Image({
      url: cardInfo.imgSrc,
      alt: 'cardName',
    }),
    buttons: new Button({
      title: 'Keyforge Compendium',
      url: cardInfo.cardLink,
    }),
  }));
  conv.ask('Would you like to hear about another card or a rule?');
});

app.intent('Rule Name', (conv, { Rule }) => {
  // eslint-disable-next-line no-param-reassign
  conv.data.Rule = Rule;
  const ruleInfo = ruleData[Rule][0];
  conv.ask(ruleInfo);
  conv.ask('Would you like to hear about another rule or a card?');
  // if (ruleData[Rule].length > 1) {
  //   conv.ask('Would you like to hear more about this rule?');
  // } else {
  //   conv.ask('Would you like to hear about another rule or a card?');
  // }
});

app.intent('Rule Name - yes', (conv) => {
  const { Rule } = conv.data;
  const returnString = ruleData[Rule].splice(1).join(' ');
  conv.ask(returnString);
  conv.ask('Would you like to hear about another rule or a card?');
});

expressApp.get('/', (req, res) => {
  res.send('We\'re up!');
});

expressApp.get('/cards/:cardName', (req, res) => {
  const cardName = (req.params.cardName).toLowerCase();
  let responseString = {};
  const cardInfo = cardData[cardName];

  if (cardInfo) {
    responseString = `Type - ${cardInfo.Type}. 
        House - ${cardInfo.House}. 
        Card Description - ${cardInfo['Card Text']} 
        Aember - ${cardInfo['\u00c6mber']}.`;
  }

  res.send(responseString);
});

expressApp.get('/rules/:ruleName', (req, res) => {
  const { ruleName } = req.params;
  const ruleInfo = ruleData[ruleName][0];

  res.send(ruleInfo);
});

expressApp.get('/cards/', (req, res) => {
  res.json(cardData);
});

expressApp.post('/fulfillment', app);

expressApp.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
