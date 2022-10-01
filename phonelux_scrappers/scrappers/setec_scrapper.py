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

offer_shop = "Setec"  # offer shop
last_updated = datetime.now().date()
is_validated = False

# Setec phone offers that are already in database

offers = json.loads(unicodedata.normalize('NFKD', requests.get('http://localhost:8080/phoneoffer/shop/setec').text))

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

for i in range(1, 9):
    setec_url = 'https://setec.mk/index.php?route=product/category&path=10066_10067&page=' + str(i)

    response1 = requests.get(setec_url)
    soup1 = BeautifulSoup(response1.content, 'html.parser')

    phones = soup1.find('div', {'id': 'mfilter-content-container'}) \
        .find_all('div', {'class': 'col-sm-4 col-xs-6'})

    for phone in phones:
        offer_url = phone.find('div', {'class': 'left'}).find('a').get('href')
        image_url = phone.find('div', {'class': 'left'}).find('a').find('img').get('src')
        offer_name = phone.find('div', {'class': 'right'}).find('div', {'class': 'name'}).find('a').get_text().strip()
        brand = offer_name.split(' ')[0]

        back_camera = None
        operating_system = None
        chipset = None
        battery = None
        ram_memory = None
        rom_memory = None
        cpu = None
        front_camera = None
        color = None

        if 'Cable' in offer_name or 'AirTag' in offer_name:
            continue

        if brand not in offer_name:
            offer_name = brand + " " + offer_name

        offer_shop_code = phone.find('div', {'class': 'right'}) \
            .find('div', {'class': 'shifra'}).get_text().replace('Шифра:', '').strip()

        price_tag = phone.find('div', {'class': 'right'}).find('div', {'class': 'price'}). \
            find('div', {'class': 'category-price-redovna'}).find('span', {'class': 'price-old-new'})

        if price_tag is None:
            price_tag = phone.find('div', {'class': 'right'}).find('div', {'class': 'price'}). \
                find('div', {'class': 'category-price-redovna'}).find('span', {'class': 'cena_za_kesh'})

        price = int(price_tag.get_text().replace('Ден.', '').replace(',', '').strip())

        response2 = requests.get(offer_url)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        offer_description = soup2.find('div', {'id': 'tab-description'}).get_text(separator='\n')

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