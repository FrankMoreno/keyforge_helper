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
        attribute = infoRow.strong.get_text()
        attributeValue = infoRow.find(text=True, recursive=False).strip()
        if 'mber' in attribute:
            attribute = 'Aember'
        elif attribute == 'Rarity':
            attributeValue = infoRow.find_all(text=True, recursive=False)[1].strip()
        INFO[attribute] = attributeValue

    return INFO

def main():
    CARDS = {}
    session = requests.Session()
    KEYFORGE_COMPENDIUM = 'https://keyforge-compendium.com'

    allCards = getCardLinks(session, KEYFORGE_COMPENDIUM)
    count = 0
    for card in allCards.find_all('div', class_='kfc__cardlist__card kfc-card'):
        card_name = card.h5.get_text()
        CARDS[card_name]=getCardInfo(session, KEYFORGE_COMPENDIUM+card.a['href'])
        count+=1
        if count > 1000000:
            break

    with open('data.json', 'w') as outfile:
        json.dump(CARDS, outfile)

if __name__ == '__main__':
    main()