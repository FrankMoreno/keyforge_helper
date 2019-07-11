from bs4 import BeautifulSoup
import requests
import json

def formatParagraph(p):
    p = p.get_text()
    p = p.replace('\n', ' ')
    return p.strip()

session = requests.Session()
response = session.get('https://keyforge-compendium.com/rules')
responseText = BeautifulSoup(response.text, 'html.parser')
rule_names = {'entries': []}
rules = {}

for rule in responseText.find_all('div', class_='kfc-rule'):
    ruleName = rule.find('h5').get_text().strip()
    ruleDescription = [formatParagraph(paragraph) for paragraph in rule.find_all('p')]
    rules[ruleName] = ruleDescription
    rule_names['entries'].append({'value': ruleName, 'synonyms': []})

with open('ruleData.json', 'w') as outfile:
    json.dump(rules, outfile)

with open('Rule.json', 'w') as outfile:
    json.dump(rule_names, outfile)