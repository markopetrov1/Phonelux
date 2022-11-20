import json
import unicodedata
import requests
import classes.phone
import sys


file_path = 'outputfile.txt'
sys.stdout = open(file_path, "w")

phones = json.loads(requests.get('http://localhost:8080/phones').text)
offers = json.loads(requests.get('http://localhost:8080/alloffers').text)
phones.sort(key=lambda p: p['model'], reverse=True)
offers.sort(key=lambda o: o['offer_name'])

for offer in offers:
    flag = False
    for phone in phones:
        if phone['model'].lower() in offer['offer_name'].lower():
            flag = True
            # Add phone model to offer
            requests.put('http://localhost:8080/phoneoffer/'+str(offer['id'])+'/addphonemodel/'+str(phone['id']))
            break
    if not flag:
        requests.delete('http://localhost:8080/phoneoffer/deleteoffer/' + str(offer['id']))
