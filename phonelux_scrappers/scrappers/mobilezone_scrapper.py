import unicodedata
from datetime import datetime
import psycopg2
import config_read
from bs4 import BeautifulSoup
from selenium import webdriver
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

offer_shop = "Mobile Zone"  # offer shop
last_updated = datetime.now().date()
is_validated = False

for i in range(1, 3):
    mobilezone_url = 'https://mobilezone.mk/produkt-kategorija/telefoni/novi-telefoni/page/' + str(i) + '/'

    response1 = requests.get(mobilezone_url)
    soup1 = BeautifulSoup(response1.content, 'html.parser')

    phones = soup1.find('ul', {
        'class': 'products columns-tablet-2 columns-mobile-2 --skin-proto rey-wcGap-default rey-wcGrid-default '
                 '--paginated columns-4'}).find_all('li')

    for phone in phones:
        offer_url = phone.find('a', {'class': 'woocommerce-LoopProduct-link woocommerce-loop-product__link'}).get(
            'href')
        image_url = phone.find('a', {'class': 'woocommerce-LoopProduct-link woocommerce-loop-product__link'}) \
            .find('img').get('data-lazy-src')

        brand_section = phone.find('div', {'class': 'rey-productInner'}).find('div', {'class': 'rey-brandLink'})

        if brand_section is not None:
            brand = brand_section.find('a').get_text().strip()
        else:
            brand = None

        offer_name = phone.find('h2', {'class': 'woocommerce-loop-product__title'}).find('a').get_text().strip()

        if brand is not None and brand not in offer_name:
            offer_name = brand + ' ' + offer_name

        price = int(unicodedata.normalize('NFKD', phone.find('span', {'class': 'woocommerce-Price-amount amount'})
                                          .find('bdi').get_text().replace(',', '').replace('ден', '').strip()))

        response2 = requests.get(offer_url)
        soup2 = BeautifulSoup(response2.text, 'html.parser')

        specifications = soup2.find('table', {'class': 'woocommerce-product-attributes shop_attributes'}).find_all('tr')

        back_camera = None
        front_camera = None
        rom_memory = None
        battery = None
        color = None

        for specification in specifications:
            if 'Главна камера' in specification.find('th').get_text():
                back_camera = specification.find('td').get_text().strip()

            if 'Селфи камера' in specification.find('th').get_text():
                front_camera = specification.find('td').get_text().strip()

            if 'Батерија' in specification.find('th').get_text():
                battery = specification.find('td').get_text().strip()

            if 'Меморија' in specification.find('th').get_text():
                rom_memory = specification.find('td').get_text().strip()

            if 'Боја' in specification.find('th').get_text():
                color = specification.find('td').get_text().strip()



        insert_script = 'INSERT INTO phone_offers (offer_shop, brand, offer_name , price, offer_url, image_url, ' \
                        'rom_memory, battery, color, front_camera, back_camera, last_updated, is_validated)' \
                                ' VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'
        insert_value = (offer_shop, brand, offer_name, price, offer_url, image_url, rom_memory, battery, color,
                        front_camera, back_camera, last_updated, is_validated)
        cur.execute(insert_script, insert_value)
        db_connection.commit()

cur.close()
db_connection.close()
