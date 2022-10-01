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
    totaloffers = requests.get('http://localhost:8080/totaloffers/'+str.join('*', phone['model'].split(' '))).text

    print(phone_id+'  -  '+totaloffers)

    # UPDATE DATABASE WITH NEW TOTAL OFFERS
    requests.put('http://localhost:8080/settotaloffers/' + phone_id + '/' + totaloffers)
