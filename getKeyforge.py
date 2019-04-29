from bs4 import BeautifulSoup 
import json
import requests

AEMBER_URL = '<img src="/assets/aember-8c75413114aa06d01a8f2f79d086a574d80420811cb0919f309226d54909d15e.png"/>'
DAMAGE_URL = '<img src="/assets/damage-ab680fa86e3eefa3fe517136b569543c4e46f6b91083a452271c1f4c43a5e189.png">'

def formatContent(content):
    content = str(content)
    if content == AEMBER_URL:
        return " aember"
    elif content == DAMAGE_URL:
        return " damage"
    elif "/assets/rarity" in content:
        return ""
    else:
        return content

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
        attributeInformation = infoRow.contents
        attribute = attributeInformation[0].get_text()
        attributeValue = ''.join(map(formatContent, attributeInformation[1:])).strip()
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