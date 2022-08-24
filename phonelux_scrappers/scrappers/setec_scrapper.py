import unicodedata
from datetime import datetime

import psycopg2
import config_read
from bs4 import BeautifulSoup
import requests

import sys

file_path = 'outputfile.txt'
sys.stdout = open(file_path, "w")

# Call to read the configuration file and connect to database
cinfo = config_read.get_databaseconfig("../postgresdb.config")
db_connection = psycopg2.connect(
    database=cinfo[0],
    host=cinfo[1],
    user=cinfo[2],
    password=cinfo[3]
)
cur = db_connection.cursor()

offer_shop = "Setec"  # offer shop
last_updated = datetime.now().date()
is_validated = False

for i in range(1, 7):
    setec_url = 'https://setec.mk/index.php?route=product/category&path=10066_10067&page='+str(i)

    response1 = requests.get(setec_url)
    soup1 = BeautifulSoup(response1.content, 'html.parser')

    phones = soup1.find('div', {'id': 'mfilter-content-container'}) \
        .find_all('div', {'class': 'col-sm-4 col-xs-6'})

    for phone in phones:
        offer_url = phone.find('div', {'class': 'left'}).find('a').get('href')
        image_url = phone.find('div', {'class': 'left'}).find('a').find('img').get('src')
        offer_name = phone.find('div', {'class': 'right'}).find('div', {'class': 'name'}).find('a').get_text().strip()
        brand = offer_name.split(' ')[0]

        if 'Cable' in offer_name or 'AirTag' in offer_name:
            continue

        if brand not in offer_name:
            offer_name = brand + " " + offer_name

        offer_shop_code = phone.find('div', {'class': 'right'}) \
            .find('div', {'class': 'shifra'}).get_text().replace('Шифра:', '').strip()
        price = int(phone.find('div', {'class': 'right'}).find('div', {'class': 'price'}). \
                    find('div', {'class': 'category-price-redovna'}).find('span', {'class': 'price-old-new'}) \
                    .get_text().replace('Ден.', '').replace(',', '').strip())

        response2 = requests.get(offer_url)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        offer_description = soup2.find('div', {'id': 'tab-description'}).get_text(separator='\n')

        insert_script = 'INSERT INTO phone_offers (offer_shop, brand, offer_name , price, image_url, offer_url,' \
                        'offer_shop_code, offer_description, last_updated, is_validated)' \
                        ' VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'
        insert_value = (offer_shop, brand, offer_name, price, image_url, offer_url,
                        offer_shop_code, offer_description, last_updated, is_validated)
        cur.execute(insert_script, insert_value)
        db_connection.commit()

cur.close()
db_connection.close()
