import unicodedata
from datetime import datetime
import json
import psycopg2
import config_read
from bs4 import BeautifulSoup
import requests
import sys
import unicodedata

from classes.phoneoffer import PhoneOffer

file_path = 'outputfile.txt'
sys.stdout = open(file_path, "w")

offer_shop = "A1"  # offer shop
last_updated = datetime.now().date()
is_validated = False

# A1 phone offers that are already in database

offers = json.loads(unicodedata.normalize('NFKD', requests.get('http://localhost:8080/phoneoffer/shop/a1').text))

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

a1_url = 'https://www.a1.mk/webshop/mk/phones'

response1 = requests.get(a1_url)
soup1 = BeautifulSoup(response1.content, 'html.parser')

phones = soup1.find('main', {'class', 'gsm-advisor-grid phones'}).find('div', {'class', 'd-flex'}) \
    .find_all('div', {'class', 'dvc-idtfr by4'})

new_offers = []

for phone in phones:
    brand = phone.get('data-brand').strip()
    offer_name = brand + " " + phone.get('data-model').strip()

    # if brand not in offer_name:
    #     offer_name = brand+" "+offer_name

    offer_shop_code = phone.get('data-productid').strip()
    offer_url = phone.find('a', {'class', 'device-link'}).get('href')
    image_url = phone.get('data-image')

    response2 = requests.get(offer_url)
    soup2 = BeautifulSoup(response2.content, 'html.parser')

    temp_prices = soup2.find('div', {'class': 'ured-tabs-content'}) \
        .find('div', {'class': 'cenovnik-secondary d-flex justify-content-between'}).find_all('div')

    # offer price
    price = None
    for temp_price in temp_prices:
        if 'Цена само за уред' in temp_price.get_text().strip():
            price = int(temp_price.get_text().replace('Цена само за уред', '')
                        .replace('Одбери', '').replace('денари', '').replace('.', '').strip())

    colors_section = soup2.find('div', {'id': 'hero'}).find('div', {'class': 'widget'}).find_all('label')

    temp_colors = []
    for color_section in colors_section:
        temp_colors.append(color_section.get('data-content'))

    color = ','.join(temp_colors)  # colors available for the offer

    phone_description = soup2.find('div', {'class': 'desc section'}).find('p').get_text().strip()

    table_rows = soup2.find('table', {'class': 'table karakteristiki'}).find_all('tr')

    back_camera = None
    operating_system = None
    cpu = None
    rom_memory = None
    ram_memory = None
    battery = None
    front_camera = None
    chipset = None
    offer_description = None

    for row in table_rows:
        if 'Камера' in row.get_text().strip():
            back_camera = row.get_text().replace('Камера', '').strip()

        if 'Оперативен систем' in row.get_text().strip():
            operating_system = row.get_text().replace('Оперативен систем', '').strip()

        if 'CPU' in row.get_text().strip():
            cpu = row.get_text().replace('CPU', '').strip()

        if 'Вградена меморија' in row.get_text().strip():
            rom_memory = row.get_text().replace('Вградена меморија', '').strip()

        if 'RAM меморија' in row.get_text().strip():
            ram_memory = row.get_text().replace('RAM меморија', '').strip()

        if 'Батерија' in row.get_text().strip():
            battery = row.get_text().replace('Батерија', '').strip()

        if 'Предна камера' in row.get_text().strip():
            front_camera = row.get_text().replace('Предна камера', '').strip()

    new_offers.append(PhoneOffer(offer_shop, offer_name, price, ram_memory, rom_memory,
                                 color, front_camera, back_camera, chipset, battery, operating_system, cpu, image_url,
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
        requests.post('http://localhost:8080/phoneoffer/addoffer', headers=headers, data=json.dumps(new_offer.__dict__,
                                                                                                    default=str))

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
