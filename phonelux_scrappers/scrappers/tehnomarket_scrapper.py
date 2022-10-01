import json
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


def scrape_function(driver1, i, new_offers):
    offer_shop = "Tehnomarket"  # offer shop
    last_updated = datetime.now().date()
    is_validated = False

    tehnomarket_html = driver1.page_source
    soup1 = BeautifulSoup(tehnomarket_html, 'html.parser')
    active_li = soup1.find('div', {'class': 'adjust-elems pagination pagination-centered'}).find('li',
                                                                                                 {'class': 'active'})

    print('page: ' + active_li.get_text())

    if int(active_li.get_text().strip()) == i:
        phones = soup1.find('ul', {'class': 'products products-display-grid thumbnails'}).find_all('li', {
            'class': 'span4 product-fix'})

        for phone in phones:
            offer_url = phone.find('a').get('href')
            offer_name = phone.find('div', {'class': 'product-name'}).get_text().strip()
            price = int(phone.find('div', {'class': 'product-price clearfix'}).find('strong') \
                        .get_text().replace('ден.', '').replace(',', '').strip())

            response2 = requests.get(offer_url)
            soup2 = BeautifulSoup(response2.content, 'html.parser')

            image = soup2.find('div', {'id': 'product_gallery'}).find('img')

            image_url = None
            if image is not None:
                image_url = image.get('src')

            details = soup2.find('div', {'class': 'product-desc'}).get_text().split('\n')

            brand = details[2].strip().capitalize()
            offer_shop_code = details[4].strip()

            back_camera = None
            operating_system = None
            chipset = None
            battery = None
            ram_memory = None
            rom_memory = None
            cpu = None
            front_camera = None
            color = None

            specifications = []
            for info in soup2.find_all('span', {'class': 'info'}):
                specifications.append(info.get_text())

            offer_description = '\n'.join(specifications)

            new_offers.append(PhoneOffer(offer_shop, offer_name, price, ram_memory, rom_memory,
                                         color, front_camera, back_camera, chipset, battery, operating_system, cpu,
                                         image_url,
                                         offer_url, last_updated, is_validated, offer_description, offer_shop_code))
    else:
        driver1.implicitly_wait(30)
        scrape_function(driver1, i, new_offers)


# Tehnomarket phone offers that are already in database

offers = json.loads(
    unicodedata.normalize('NFKD', requests.get('http://localhost:8080/phoneoffer/shop/tehnomarket').text))

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
    tehnomarket_url = 'https://tehnomarket.com.mk/category/4109/mobilni-telefoni#page/' + str(i)
    # print(anhoch_url)

    # selenium is used because of the dynamic content of the page
    driver1 = webdriver.Safari(executable_path='/usr/bin/safaridriver')
    driver1.get(tehnomarket_url)

    scrape_function(driver1, i, new_offers)

    # closing the driver so the safari instance can pair with another webdriver session
    driver1.close()

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
