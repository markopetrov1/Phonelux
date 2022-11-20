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

offer_shop = "Mobile Zone"  # offer shop
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
    # Mobile Zone phone offers that are already in database
    offers = json.loads(unicodedata.normalize('NFKD', requests.get('http://localhost:8080/phoneoffer/shop/mobilezone').text))

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

            price_tag = phone.find('span', {'class': 'woocommerce-Price-amount amount'})
            price = None

            if price_tag is not None:
                price = int(unicodedata.normalize('NFKD', price_tag.find('bdi').get_text()
                                              .replace(',', '')
                                              .replace('ден', '').strip()))
            else:
                continue

            response2 = requests.get(offer_url)
            soup2 = BeautifulSoup(response2.text, 'html.parser')

            specifications = soup2.find('table', {'class': 'woocommerce-product-attributes shop_attributes'}).find_all('tr')

            back_camera = None
            front_camera = None
            rom_memory = None
            ram_memory = None
            operating_system = None
            cpu = None
            chipset = None
            offer_description = None
            offer_shop_code = None
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
