import unicodedata
from datetime import datetime
import psycopg2
import config_read
from bs4 import BeautifulSoup
from selenium import webdriver
import requests

import sys

file_path = 'outputfile.txt'
sys.stdout = open(file_path, "w")

# Call to read the configuration file and connect to database
cinfo = config_read.get_databaseconfig("../postgresdb.config")
db_connection = psycopg2.connect(
    database=cinfo[0],
    host=cinfo[1],
    user=cinfo[2],
    password=cinfo[3]
)
cur = db_connection.cursor()


def scrape_function(driver1, i):
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

            specifications = []
            for info in soup2.find_all('span', {'class': 'info'}):
                specifications.append(info.get_text())

            print(brand)
            print(offer_name)
            print()
            print()

            offer_description = '\n'.join(specifications)

            insert_script = 'INSERT INTO phone_offers (offer_shop, brand, offer_name, price, image_url, offer_url,' \
                            'offer_description, offer_shop_code, last_updated, is_validated)' \
                            ' VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'
            insert_value = (offer_shop, brand, offer_name, price, image_url, offer_url, offer_description,
                            offer_shop_code, last_updated, is_validated)
            cur.execute(insert_script, insert_value)
            db_connection.commit()
    else:
        driver1.implicitly_wait(30)
        scrape_function(driver1, i)


for i in range(1, 6):
    tehnomarket_url = 'https://tehnomarket.com.mk/category/4109/mobilni-telefoni#page/' + str(i)
    # print(anhoch_url)

    # selenium is used because of the dynamic content of the page
    driver1 = webdriver.Safari(executable_path='/usr/bin/safaridriver')
    driver1.get(tehnomarket_url)

    scrape_function(driver1, i)
    # closing the driver so the safari instance can pair with another webdriver session
    driver1.close()

cur.close()
db_connection.close()
