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

offer_shop = "Neptun"  # offer shop
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
    # Neptun phone offers that are already in database
    offers = json.loads(unicodedata.normalize('NFKD', requests.get('http://localhost:8080/phoneoffer/shop/neptun').text))

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

    for i in range(1, 11):
        neptun_url = 'https://www.neptun.mk/mobilni_telefoni.nspx?page=' + str(i)

        # selenium is used because of the dynamic content of the page
        driver1 = webdriver.Safari(executable_path='/usr/bin/safaridriver')
        driver1.get(neptun_url)
        neptun_html = driver1.page_source

        # closing the driver so the safari instance can pair with another webdriver session
        driver1.close()

        # response1 = requests.get(neptun_url)
        soup1 = BeautifulSoup(neptun_html, 'html.parser')

        phones = soup1.find('div', {'id': 'mainContainer'}).find('div',
                                                                 {'class': 'col-lg-9 col-md-9 col-sm-8 col-fix-main'}) \
            .find_all('div', {'class': 'ng-scope product-list-item-grid'})

        for phone in phones:
            offer_url = 'https://www.neptun.mk' + phone.find('a').get('href')
            offer_name = phone.find('a').find('h2').get_text().replace('MOB.TEL.', '').strip()
            brand = offer_name.split(' ')[0].strip().capitalize()
            image_url = 'https://www.neptun.mk' + phone.find('a').find('div', {'class': 'row'}).find('img').get('src')
            price = int(
                phone.find('div', {'class': 'col-sm-12 static'}).find('div', {'class': 'product-list-item__prices pt35'})
                .find('div', {'class': 'row'}).find('div', {'class': 'newPriceModel'}) \
                .find('span', {'class': 'product-price__amount--value ng-binding'}).get_text().replace('.', ''))

            driver1 = webdriver.Safari(executable_path='/usr/bin/safaridriver')
            driver1.get(offer_url)
            offer_html = driver1.page_source
            # closing the driver so the safari instance can pair with another webdriver session
            driver1.close()

            soup2 = BeautifulSoup(offer_html, 'html.parser')

            offer_shop_code = soup2.find('div', {'ng-if': 'showProductDetails'}) \
                .find('div', {'class': 'product-details-first-row'}).find('span', {
                'ng-bind': 'model.CodeNumber'}).get_text().strip()

            specifications_table = \
                soup2.find('div', {'id': 'mainContainer'}).find('div', {'ng-if': 'showProductDetails'}).find_all('ul')[-1]
            specifications = specifications_table.get_text(separator='\n').strip().split("\n")

            offer_description = specifications_table.get_text(separator='\n').strip()

            back_camera = None
            operating_system = None
            chipset = None
            battery = None
            ram_memory = None
            rom_memory = None
            cpu = None
            front_camera = None
            color = None

            for specification in specifications:
                if 'Батерија:' in specification:
                    battery = specification.split('Батерија:')[1]

                if 'CPU:' in specification:
                    cpu = specification.split('CPU:')[1]

                if 'Chipset:' in specification:
                    chipset = specification.split('Chipset:')[1]

                if 'RAM Меморија:' in specification:
                    ram_memory = specification.split('RAM Меморија:')[1]
                    continue

                if 'ROM Меморија:' in specification:
                    rom_memory = specification.split('ROM Меморија:')[1]
                    continue

                if 'ROM:' in specification:
                    rom_memory = specification.split('ROM:')[1]

                if 'RAM:' in specification:
                    ram_memory = specification.split('RAM:')[1]

                if 'iOS' in specification or 'Android' in specification:
                    operating_system = specification

            new_offers.append(PhoneOffer(offer_shop, offer_name, price, ram_memory, rom_memory,
                                         color, front_camera, back_camera, chipset, battery, operating_system, cpu,
                                         image_url,
                                         offer_url, last_updated, is_validated, offer_description, offer_shop_code))

    for new_offer in new_offers:
        flag = False
        flag_price = False
        offer_id = None

        for old_offer in database_offers:

            if new_offer.offer_shop_code == old_offer.offer_shop_code:
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
            if old_offer.offer_shop_code == new_offer.offer_shop_code:
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
