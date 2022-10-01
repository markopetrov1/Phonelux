import json
import psycopg2
import requests
import config_read
import sys

file_path = 'outputfile.txt'
sys.stdout = open(file_path, "w")

phones = json.loads(requests.get('http://localhost:8080/phones').text)

for phone in phones:
    phone_id = str(phone['id'])
    print(phone['model'])

    offers = list(json.loads(requests.get('http://localhost:8080/phones/offers/' + phone_id).text))
    offers.sort(key=lambda o: o['price'])
    lowest_price = str(0)
    if len(offers) > 0:
        lowest_price = str(offers[0]['price'])
    print(lowest_price)

    # UPDATE DATABASE WITH NEW LOWEST PRICE
    requests.put('http://localhost:8080/setlowestprice/' + phone_id + '/' + lowest_price)
