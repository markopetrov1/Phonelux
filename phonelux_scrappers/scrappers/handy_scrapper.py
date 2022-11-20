import json
import traceback
import unicodedata
from datetime import datetime
import psycopg2
import config_read
from bs4 import BeautifulSoup
from selenium import webdriver
import requests

import sys

from classes.phoneoffer import PhoneOffer

file_path = 'outputfile.txt'
sys.stdout = open(file_path, "w")


offer_shop = "Handy"  # offer shop
last_updated = datetime.now().date()
is_validated = False

# Call to read the configuration file and connect to database
cinfo = config_read.get_databaseconfig("../postgresdb.config")
db_connection = psycopg2.connect(
    database=cinfo[0],
    host=cinfo[1],
    user=cinfo[2],
    password=cinfo[3]
)
cur = db_connection.cursor()

try:
    # Handy phone offers that are already in database
    offers = json.loads(unicodedata.normalize('NFKD', requests.get('http://localhost:8080/phoneoffer/shop/handy').text))

    database_offers = []

    for offer in offers:
        phoneOffer = PhoneOffer(offer['id'], offer['offer_shop'], offer['offer_name'], offer['price'],
                                offer['ram_memory'],
                                offer['rom_memory'], offer['color'], offer['front_camera'], offer['back_camera'],
                                offer['chipset'], offer['battery'], offer['operating_system'], offer['cpu'],
                                offer['image_url'],
                                offer['offer_url'], offer['last_updated'], offer['is_validated'],
                                offer['offer_description'],
                                offer['offer_shop_code'])
        database_offers.append(phoneOffer)

    new_offers = []

    handy_url = 'https://www.handy.mk/telefoni?page=6'

    response1 = requests.get(handy_url)
    soup1 = BeautifulSoup(response1.content, 'html.parser')

    phones = soup1.find_all('li', {'data-hook': 'product-list-grid-item'})

    for phone in phones:
        offer_url = phone.find('a').get('href')
        offer_name = phone.find('div', {'data-hook': 'not-image-container'})\
            .find('h3', {'data-hook': 'product-item-name'}).get_text().strip()
        brand = offer_name.split(' ')[0].capitalize()
        price = int(float(phone.find('div', {'data-hook': 'not-image-container'}).find('div', {'data-hook': "product-item-product-details"})\
            .find('span', {'data-hook': 'product-item-price-to-pay'}).get_text().strip().replace('ден', '').replace('.', '').replace(',', '.')))

        response2 = requests.get(offer_url)
        soup2 = BeautifulSoup(response2.text, 'html.parser')

        back_camera = None
        operating_system = None
        chipset = None
        battery = None
        ram_memory = None
        rom_memory = None
        cpu = None
        front_camera = None
        offer_shop_code = None
        color = None
        image_url = None

        color_section = soup2.find('section', {'data-hook': 'product-colors-title-section'})
        if color_section is not None:
            temp_colors = color_section.find('fieldset', {'class': 'ColorPickerbase3548966286__container'})\
                .find_all('input', {'type': 'radio'})
            colors_list = []
            for temp_color in temp_colors:
                colors_list.append(temp_color.get('aria-label'))
            color = ','.join(colors_list)

        rows = soup2.find('div', {'data-hook': 'info-section-description'}).find_all('li')

        if len(rows) == 0:
            rows = soup2.find('div', {'data-hook': 'info-section-description'}).find_all('tr')

        specifications = []

        for row in rows:
            specifications.append(unicodedata.normalize('NFKD', row.get_text().strip()))

        offer_description = '\n'.join(specifications)

        new_offers.append(PhoneOffer(offer_shop, offer_name, price, ram_memory, rom_memory,
                                     color, front_camera, back_camera, chipset, battery, operating_system, cpu,
                                     image_url,
                                     offer_url, last_updated, is_validated, offer_description, offer_shop_code))

    for new_offer in new_offers:
        flag = False
        flag_price = False
        offer_id = None

        for old_offer in database_offers:

            if new_offer.offer_name == old_offer.offer_name:
                flag = True
                if new_offer.price != old_offer.price:
                    flag_price = True
                    offer_id = old_offer.offer_id

        if flag:
            # print('ALREADY IN DATABASE')
            # print(new_offer)
            # if it's already in database, check PRICE and if it's changed, change it !!!!!!
            if flag_price:
                print('PRICE CHANGED!')  # CHANGE PRICE
                print('offer id: ' + str(offer_id))
                headers = {'Content-type': 'application/json'}
                requests.put('http://localhost:8080/phoneoffer/' + str(offer_id) + '/changeprice/' + str(new_offer.price),
                             headers=headers)
        else:
            print('ADDED')  # ADD OFFER
            print(new_offer)
            headers = {'Content-type': 'application/json'}
            requests.post('http://localhost:8080/phoneoffer/addoffer',
                          headers=headers, data=json.dumps(new_offer.__dict__, default=str))

    print('------------------------------------')

    for old_offer in database_offers:
        flag = False
        for new_offer in new_offers:
            if old_offer.offer_name == new_offer.offer_name:
                flag = True

        if not flag:
            print('OFFER DELETED')
            print(old_offer)
            # DELETE OFFER
            requests.delete('http://localhost:8080/phoneoffer/deleteoffer/' + str(old_offer.offer_id))
except Exception:
    traceback.print_exc()
    insert_script = 'INSERT INTO scrapper_info (store, recieved_at, status)' \
                    ' VALUES (%s, %s, %s);'
    insert_value = (offer_shop, last_updated, 'failed')
    cur.execute(insert_script, insert_value)
    db_connection.commit()
    cur.close()
    db_connection.close()
else:
    insert_script = 'INSERT INTO scrapper_info (store, recieved_at, status)' \
                    ' VALUES (%s, %s, %s);'
    insert_value = (offer_shop, last_updated, 'success')
    cur.execute(insert_script, insert_value)
    db_connection.commit()
    cur.close()
    db_connection.close()



