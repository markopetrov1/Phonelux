import time
from datetime import datetime
import psycopg2
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import config_read
from bs4 import BeautifulSoup
import requests
import unicodedata
import sys

file_path = '../outputfile.txt'
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
    offer_shop = "Anhoch"  # offer shop
    last_updated = datetime.now().date()
    is_validated = False

    anhoch_html = driver1.page_source
    soup1 = BeautifulSoup(anhoch_html, 'html.parser')
    active_li = soup1.find('div', {'class': 'adjust-elems pagination pagination-centered'}).find('li', {'class': 'active'})

    li_element = int(active_li.get_text().strip())

    print('page: '+str(li_element))

    if int(active_li.get_text().strip()) == i:
        phones = soup1.find('section', {'id': 'main'}).find('div', {'class': 'span8'}) \
            .find('div', {'class': 'products'}).find_all('li')
        for phone in phones:
            offer_url = phone.find('a').get('href')
            image_url = phone.find('a').find('img').get('src')
            offer_name = phone.find('div', {'class': 'product-name'}).find('a').get_text().strip()
            price = int(phone.get('data-price'))
            brand = phone.find('div', {'class': 'product-price'}).find_all('div')[2].find('strong').get_text().strip()

            response2 = requests.get(offer_url)
            soup2 = BeautifulSoup(response2.content, 'html.parser')
            offer_shop_code = soup2.find('div', {'class': 'product-desc'}).get_text().strip().split('\n')[3]

            offer_description = soup2.find('div', {'class': 'description'}) \
                .find('div', {'class': 'tab-content'}).find('pre').get_text().strip()

            print(offer_name)
            print(brand)
            print()
            print()

            # insert_script = 'INSERT INTO phone_offers (offer_shop, brand, offer_name , price, image_url, offer_url,' \
            #                 'offer_shop_code, offer_description, last_updated, is_validated)' \
            #                 ' VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'
            # insert_value = (offer_shop, brand, offer_name, price, image_url, offer_url,
            #                 offer_shop_code, offer_description, last_updated, is_validated)
            # cur.execute(insert_script, insert_value)
            # db_connection.commit()
    else:
        driver1.implicitly_wait(5)
        scrape_function(driver1, i)


for i in range(1, 19):
    anhoch_url = "https://www.anhoch.com/category/3017/smartfoni-i-mobilni-tel#page/"+str(i)
    # print(anhoch_url)

    # selenium is used because of the dynamic content of the page
    driver1 = webdriver.Safari(executable_path='/usr/bin/safaridriver')
    driver1.get(anhoch_url)

    scrape_function(driver1, i)
    # closing the driver so the safari instance can pair with another webdriver session
    driver1.close()


cur.close()
db_connection.close()
