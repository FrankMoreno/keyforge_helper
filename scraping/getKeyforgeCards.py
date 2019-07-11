from bs4 import BeautifulSoup 
import json
import requests
import threading
import time

class KeyforgeData:
    def __init__(self):
        self.cards = {}
        self.card_names = {"entries": []}

    def addToCards(self, cardKey, cardValue):
        self.cards[cardKey] = cardValue

    def addToCardNames(self, card_name):
        self.card_names["entries"].append({"value": card_name, "synonyms": []})

class KFCompendiumHandler:
    def __init__(self):
        self.keyforge_url = 'https://keyforge-compendium.com'
        self.expansion_url = 'https://keyforge-compendium.com'
        self.session = requests.Session()

    def getCardLinks(self):
        response = self.session.get(self.expansion_url)
        responseText = BeautifulSoup(response.text, 'html.parser')
        return responseText.find_all('div', class_='kfc__cardlist__card kfc-card')

    def getCardName(self, card):
        return card.h5.get_text().lower()

    def getCardInfo(self, card):
        card_link = self.keyforge_url+card.a['href']
        response = self.session.get(card_link)
        while response.status_code != 200:
            time.sleep(5)
            response = self.session.get(card_link)
        # else:
        responseText = BeautifulSoup(response.text, 'html.parser')
        cardInfo = responseText.find('div', class_='kfc__card__info').ul
        info = self.buildInfoObject(cardInfo)
        info['imgSrc'] = responseText.find('img', class_='card-img-top')['src']
        info['cardLink'] = card_link
        return info

    def buildInfoObject(self, cardInfo):
        INFO = {}
        for infoRow in cardInfo.find_all('li'):
            attributeInformation = infoRow.contents
            attribute = attributeInformation[0].get_text()
            attributeValue = ''.join(map(self.formatCardAttributeInformation, attributeInformation[1:])).strip()
            INFO[attribute] = attributeValue
        
        return INFO

    def formatCardAttributeInformation(self, content):
        aember_url = '<img src="/assets/aember-8c75413114aa06d01a8f2f79d086a574d80420811cb0919f309226d54909d15e.png"/>'
        damage_url = '<img src="/assets/damage-ab680fa86e3eefa3fe517136b569543c4e46f6b91083a452271c1f4c43a5e189.png"/>'

        content = str(content)
        if content == aember_url:
            return " aember"
        elif content == damage_url:
            return " damage"
        elif "/assets/rarity" in content:
            return ""
        else:
            return content

def compileData(card, keyforgeData, kfcHandler, lock):
    card_key = kfcHandler.getCardName(card)
    if card_key not in keyforgeData.cards:
        try:
            card_value = kfcHandler.getCardInfo(card)
            lock.acquire()
            keyforgeData.addToCards(card_key, card_value)
            keyforgeData.addToCardNames(card_key)
            lock.release()
        except Exception as e: 
            print(e)
            print(card_key)
    else:
        print('Repeat:' + card_key) 

def main():
    keyforgeData = KeyforgeData()
    kfcHandler = KFCompendiumHandler()
    lock = threading.Lock()
    
    threads = [threading.Thread(target=compileData, args=(card, keyforgeData, kfcHandler, lock)) for card in kfcHandler.getCardLinks()]
    [thread.start() for thread in threads]
    [thread.join() for thread in threads]

    kfcHandler.expansion_url = 'https://keyforge-compendium.com/cards?utf8=%E2%9C%93&filterrific%5Bsearch_title%5D=&filterrific%5Bsearch_text%5D=&filterrific%5Bwith_traits%5D=&filterrific%5Bwith_power%5D=&filterrific%5Bwith_armor%5D=&filterrific%5Btype_like%5D=&filterrific%5Bhouse_like%5D=&filterrific%5Brarity_like%5D=&filterrific%5Bwith_expansion%5D=2&filterrific%5Bwith_tags%5D=&filterrific%5Bsorted_by%5D=number_asc&commit=Filter+Results'
    threads = [threading.Thread(target=compileData, args=(card, keyforgeData, kfcHandler, lock)) for card in kfcHandler.getCardLinks()]
    [thread.start() for thread in threads]
    [thread.join() for thread in threads]

    with open('./resources/cardData.json', 'w') as outfile:
        json.dump(keyforgeData.cards, outfile)

    with open('./resources/Card.json', 'w') as outfile:
        json.dump(keyforgeData.card_names, outfile)
        
if __name__ == '__main__':
    main()