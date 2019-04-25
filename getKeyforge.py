from bs4 import BeautifulSoup 
import json
import requests

def getCardLinks(session, KEYFORGE_COMPENDIUM):
    KEYFORGE_COMPENDIUM = 'https://keyforge-compendium.com'
    response = session.get(KEYFORGE_COMPENDIUM)
    return BeautifulSoup(response.text, 'html.parser')

def getCardInfo(session, CARD_LINK):
    INFO = {}
    response = session.get(CARD_LINK)
    if response.status_code != 200:
        return {}
    cardInfo = BeautifulSoup(response.text, 'html.parser')
    cardInfo = cardInfo.find('div', class_='kfc__card__info').ul

    for infoRow in cardInfo.find_all('li'):
        attributeInformation = infoRow.findAll(text=True)
        attribute = attributeInformation[0]
        attributeValue = "".join(attributeInformation[1:]).strip()
        INFO[attribute] = attributeValue

    return INFO

def main():
    CARDS = {}
    CARD_NAMES = {"entries": []}
    session = requests.Session()
    KEYFORGE_COMPENDIUM = 'https://keyforge-compendium.com'

    allCards = getCardLinks(session, KEYFORGE_COMPENDIUM)

    for card in allCards.find_all('div', class_='kfc__cardlist__card kfc-card'):
        card_name = card.h5.get_text()
        card_name = card_name.lower()
        CARDS[card_name]=getCardInfo(session, KEYFORGE_COMPENDIUM+card.a['href'])
        CARD_NAMES["entries"].append({"value": card_name, "synonyms": []})
    
    with open('data.json', 'w') as outfile:
        json.dump(CARDS, outfile)

    with open('Card.json', 'w') as outfile:
        json.dump(CARD_NAMES, outfile)
        
if __name__ == '__main__':
    main()