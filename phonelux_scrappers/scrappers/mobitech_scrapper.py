import json
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


mobitech_url = "https://mobitech.mk/shop/"

response1 = requests.get(mobitech_url)

soup1 = BeautifulSoup(response1.content, 'html.parser')

phones = soup1.find_all('div', {'class': 'jet-woo-products__inner-box'})

offer_shop = "Mobitech"  # offer shop
last_updated = datetime.now().date()
is_validated = False

# Mobitech phone offers that are already in database

offers = json.loads(unicodedata.normalize('NFKD', requests.get('http://localhost:8080/phoneoffer/shop/mobitech').text))

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

for phone in phones:
    offer_url = phone.find('h5', {'class': 'jet-woo-product-title'}).find('a').get('href')  # url
    image_url = phone.find('div', {'class': 'jet-woo-product-thumbnail'}).find('img').get('src')  # image
    brand = phone.find_next('div', {'class': 'jet-woo-product-categories'}).find('a').get_text().strip()  # brand
    offer_name = phone.find('h5', {'class': 'jet-woo-product-title'}).find('a').get_text().strip()  # offer_name
    if brand not in offer_name:
        offer_name = brand+" "+offer_name
    temp_prices = phone.find('div', {'class': 'jet-woo-product-price'}).find_all('bdi')
    price = int(float(temp_prices[len(temp_prices) - 1].get_text().replace("ден", "").replace(",", "").strip())) # price

    response2 = requests.get(offer_url)
    soup2 = BeautifulSoup(response2.content, 'html.parser')

    specifications = soup2.find_all('h2', {'class': 'elementor-heading-title elementor-size-default'})

    ram_memory = None
    rom_memory = None
    battery = None
    back_camera = None
    front_camera = None
    operating_system = None
    chipset = None
    color = None
    offer_shop_code = None
    cpu = None
    offer_description = None

    for specification in specifications:
        # rom memory
        if specification.get_text().startswith("Меморија:"):
            rom_memory = specification.get_text().split("Меморија:")[1].strip()
            if rom_memory == "Нема" or rom_memory == "/":
                rom_memory = None

        # ram memory
        if specification.get_text().startswith("РАМ Меморија:"):
            ram_memory = specification.get_text().split("РАМ Меморија:")[1].replace('RAM', '')\
                .replace('Ram', '').strip()
            if ram_memory == "Нема" or ram_memory == "/":
                ram_memory = None

        # camera
        if specification.get_text().startswith("Камера:"):
            back_camera = specification.get_text().split("Камера:")[1].strip()
            if back_camera == "Нема":
                back_camera = None

        # operating system
        if specification.get_text().startswith("Оперативен систем:"):
            operating_system = specification.get_text().split("Оперативен систем:")[1].split(",")[0].strip()
            if operating_system == "Нема":
                operating_system = None

        # battery
        if specification.get_text().startswith("Батерија:"):
            battery = specification.get_text().split("Батерија:")[1].strip()
            if battery == "Нема":
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

