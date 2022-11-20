import json
import traceback
from datetime import datetime

import psycopg2
import config_read
from bs4 import BeautifulSoup
import requests
import unicodedata
import sys
from classes.phoneoffer import PhoneOffer

file_path = 'outputfile.txt'
sys.stdout = open(file_path, "w")


offer_shop = "Akcija"  # offer shop
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
    # Akcija phone offers that are already in database
    offers = json.loads(unicodedata.normalize('NFKD', requests.get('http://localhost:8080/phoneoffer/shop/akcija').text))

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

    i = 0
    while i <= 20:
        akcija_url = "https://akcija.com.mk/listing/" + str(i) + "?category=mobilnitelefoni"
        response1 = requests.get(akcija_url)
        response1.encoding = 'utf-8'
        soup1 = BeautifulSoup(response1.text, 'html.parser')

        phones = soup1.find_all('div', {'class', 'product-item__body pb-xl-2'})

        for phone in phones:
            offer_name = phone.find('h5', {'class': 'mb-1 product-item__title'}).find('a') \
                .get_text().replace('Паметен телефон', '').strip()
            brand = offer_name.split(' ')[0]

            if brand not in offer_name:
                offer_name = brand + " " + offer_name

            offer_url = phone.find('h5', {'class': 'mb-1 product-item__title'}).find('a').get('href')
            image_url = phone.find('div', {'class', 'mb-2'}).find('img').get('src')
            price = int(phone.find('div', {'class', 'flex-center-between mb-1 pt-xl-2'}) \
                        .find('ins').get_text().split(' ')[0].strip())

            response2 = requests.get(offer_url)
            response2.encoding = 'utf-8'
            soup2 = BeautifulSoup(response2.text, 'html.parser')

            back_camera = None
            operating_system = None
            chipset = None
            battery = None
            ram_memory = None
            rom_memory = None
            cpu = None
            front_camera = None
            color = None
            offer_shop_code = None

            specifications = soup2.find('main', {'id': 'content'}) \
                .find_all('div', {'class', 'container'})[1].find('div', {'class', 'mb-14'}) \
                .find('div', {'class', 'col-md-6 col-lg-4 col-xl-4 mb-md-6 mb-lg-0'}).find_all('p')

            offer_description = ''
            for specification in specifications:
                if 'Код за нарачка' in str(specification.get_text(separator='\n').replace('NBSP', '').strip()):
                    continue
                offer_description += unicodedata.normalize('NFKD',
                                                           str(specification.get_text(separator='\n').strip())) + "\n"

            new_offers.append(PhoneOffer(offer_shop, offer_name, price, ram_memory, rom_memory,
                                         color, front_camera, back_camera, chipset, battery, operating_system, cpu,
                                         image_url,
                                         offer_url, last_updated, is_validated, offer_description, offer_shop_code))
        i += 20

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

