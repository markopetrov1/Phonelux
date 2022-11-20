import json
import traceback
import unicodedata
from datetime import datetime

import psycopg2
import config_read
from bs4 import BeautifulSoup
import requests
import sys

from classes.phoneoffer import PhoneOffer

file_path = 'outputfile.txt'
sys.stdout = open(file_path, "w")

offer_shop = "Mobi Go"  # offer shop
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
    # Mobi Go phone offers that are already in database
    offers = json.loads(unicodedata.normalize('NFKD', requests.get('http://localhost:8080/phoneoffer/shop/mobigo').text))

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


    for i in range(1, 6):
        mobigo_url = "https://mobigo.mk/page/" + str(i) + "/"

        response1 = requests.get(mobigo_url)

        soup1 = BeautifulSoup(response1.content, 'html.parser')

        phone_sections = soup1.find_all('ul', {'class': 'recent-posts'})
        phones = phone_sections[len(phone_sections) - 1].find_all('li')

        for phone in phones:
            offer_url = phone.find('div', {'class', 'post-thumb'}).find('a').get('href')  # offer url
            image_url = phone.find('div', {'class', 'post-thumb'}).find('a').find('img').get('src')  # image url
            offer_name = phone.find('div', {'class', 'post-content'}).find_all('h2')[0].get_text().strip()  # offer_name

            if "Watch" in offer_name or "Tab" in offer_name:  # if the product is watch or tablet, continue
                continue

            price = int(float(phone.find('div', {'class', 'post-content'}).find_all('h2')[1] \
                              .get_text().replace('ден.', '').replace('.', '').strip()))  # price

            response2 = requests.get(offer_url)
            soup2 = BeautifulSoup(response2.content, 'html.parser')

            brand = soup2.find('a', {'rel': 'category tag'}).get_text().strip()  # brand

            if brand not in offer_name:
                offer_name = brand + " " + offer_name

            specifications = soup2.find('table', {'id': 'singlet'}).find_all('tr')

            ram_memory = None
            rom_memory = None
            battery = None
            back_camera = None
            front_camera = None
            chipset = None
            operating_system = None
            cpu = None
            offer_shop_code = None
            offer_description = None
            color = None

            for specification in specifications:
                if specification.find('td') == None:
                    continue

                # operating system
                if specification.find('td').get_text() == "Платформа":
                    if specification.find('i').get_text() != "/":
                        operating_system = specification.find('i').get_text().strip()
                    else:
                        operating_system = None

                # chipset
                if specification.find('td').get_text() == "Chipset":
                    if specification.find('i').get_text() != "/":
                        chipset = specification.find('i').get_text().strip()
                    else:
                        chipset = None

                # ram and rom memory
                if specification.find('td').get_text() == "Меморија":
                    if specification.find('i').get_text() != "/":
                        rom_memory = specification.find('i').get_text().replace(',', '').split(' ')[0].strip()
                        ram_memory = specification.find('i').get_text().replace(',', '').split(' ')[1].strip()
                    else:
                        rom_memory = None
                        ram_memory = None

                # back camera
                if specification.find('td').get_text() == "Главна Камера":
                    if specification.find('i').get_text() != "/":
                        back_camera = specification.find('i').get_text().strip()
                    else:
                        back_camera = None

                # front camera
                if specification.find('td').get_text() == "Селфи Камера":
                    if specification.find('i').get_text() != "/":
                        front_camera = specification.find('i').get_text().strip()
                    else:
                        front_camera = None

                # battery
                if specification.find('td').get_text() == "Батерија":
                    if specification.find('i').get_text() != "/":
                        battery = specification.find('i').get_text().strip()
                    else:
                        battery = None

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
            print('ALREADY IN DATABASE')
            print(new_offer)
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
