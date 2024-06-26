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

offer_shop = "Ledikom"  # offer shop
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
    # Ledikom phone offers that are already in database
    offers = json.loads(unicodedata.normalize('NFKD', requests.get('http://localhost:8080/phoneoffer/shop/ledikom').text))

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

    ledikom_phone_urls = [
        'https://ledikom.mk/c/416/uredi/apple/iphone?limit=96',
        'https://ledikom.mk/c/421/uredi/samsung/telefoni?limit=96',
        'https://ledikom.mk/c/424/mobilni-telefoni/xiaomi/telefoni?limit=96',
        'https://ledikom.mk/c/430/uredi/huawei/telefoni?limit=96',
        'https://ledikom.mk/c/441/uredi/oneplus/telefoni?limit=96',
        'https://ledikom.mk/c/413/uredi/google/telefoni?limit=96',
        'https://ledikom.mk/c/411/uredi/honor/telefoni?limit=96',
        'https://ledikom.mk/c/460/uredi/nokia/telefoni?limit=96',
        'https://ledikom.mk/c/461/uredi/asus/telefoni?limit=96',
        'https://ledikom.mk/c/488/proizvodi/oppo/telefoni?limit=96'
    ]

    for ledikom_url in ledikom_phone_urls:

        # selenium is used because of the dynamic content of the page
        driver1 = webdriver.Safari(executable_path='/usr/bin/safaridriver')
        driver1.get(ledikom_url)
        ledikom_html = driver1.page_source

        # closing the driver so the safari instance can pair with another webdriver session
        driver1.close()

        soup1 = BeautifulSoup(ledikom_html, 'html.parser')

        phones = soup1.find('div', {'id': 'content'}) \
            .find('div', {'class': 'container'}).find('div', {'class': 'row'}).find('div', {'class': 'item-display'}) \
            .find_all('div', {'class': 'item-in-grid'})

        if len(phones) == 0:
            continue

        for phone in phones:
            offer_url = 'https://ledikom.mk' + phone.find('a').get('href')
            image_url = phone.find('a').find('img').get('src')
            temp_offer_name = phone.find('div', {'class': 'item-name'}).find('a').get_text().strip()
            offer_name = ' '.join(temp_offer_name.split())
            brand = offer_name.split(' ')[0]
            price = int(phone.find('span', {'class': 'price'}).get_text().replace('ден.', '')
                        .replace('ден', '')
                        .replace('.', '').strip())

            driver1 = webdriver.Safari(executable_path='/usr/bin/safaridriver')
            driver1.get(offer_url)
            # getting offer page html
            offer_html = driver1.page_source
            driver1.close()

            soup2 = BeautifulSoup(offer_html, 'html.parser')

            specifications = soup2.find('div', {'id': 'content'}).find('section', {'class': 'padding-section'}) \
                .find_all('div', {'class': 'container'})[1].find('div', {'class': 'col-md-7'}) \
                .find_all('div', {'class': 'row'})

            color = None
            rom_memory = None
            ram_memory = None
            back_camera = None
            operating_system = None
            chipset = None
            battery = None
            cpu = None
            front_camera = None
            offer_shop_code = None
            offer_description = None

            if len(specifications) != 0:
                colors_tags = specifications[0].find('div', {'class': 'col-md-12 col-xs-12'}).find_all('a')
                temp_colors = []
                for color_tag in colors_tags:
                    temp_colors.append(color_tag.get_text().strip())
                color = ','.join(temp_colors)

            if len(specifications) >= 2:
                temp_rom = specifications[1].find('div', {'class': 'col-md-12 col-xs-12'}).find_all('a')
                rom_list = []
                for rom in temp_rom:
                    rom_list.append(rom.get('title'))
                rom_memory = ','.join(rom_list)

            if len(specifications) >= 3:
                temp_ram = specifications[2].find('div', {'class': 'col-md-12 col-xs-12'}).find_all('a')
                ram_list = []
                for ram in temp_ram:
                    ram_list.append(ram.get('title'))

                ram_memory = ','.join(ram_list)

            if 'Xiaomi' in brand:
                temp = color
                color = rom_memory
                rom_memory = temp

                temp = ram_memory
                ram_memory = color
                color = temp

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

