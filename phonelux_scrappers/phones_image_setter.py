import json
import requests
import classes.phone
import sys


file_path = 'outputfile.txt'
sys.stdout = open(file_path, "w")

phones = json.loads(requests.get('http://localhost:8080/phones').text)
for phone in phones:
    phone_id = str(phone['id'])
    offers = list(json.loads(requests.get('http://localhost:8080/phones/offers/' + phone_id).text))

    offers = list(filter(lambda offer: offer['image_url'] is not None, offers))

    image_url = None

    if len(offers) > 0:
        image_url = offers[0]['image_url']

    phone['image_url'] = image_url

    # UPDATE DATABASE WITH NEW IMAGE URLS FOR PHONES
    headers = {'Content-type': 'application/json'}
    requests.put('http://localhost:8080/setimageurl/' + phone_id, headers=headers, data=phone['image_url'])