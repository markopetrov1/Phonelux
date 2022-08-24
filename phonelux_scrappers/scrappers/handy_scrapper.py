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

offer_shop = "Handy"  # offer shop
last_updated = datetime.now().date()
is_validated = False

handy_url = 'https://www.handy.mk/telefoni?page=6'

response1 = requests.get(handy_url)
soup1 = BeautifulSoup(response1.content, 'html.parser')

phones = soup1.find_all('li', {'data-hook': 'product-list-grid-item'})

for phone in phones:
    offer_url = phone.find('a').get('href')
    offer_name = phone.find('div', {'data-hook': 'not-image-container'})\
        .find('h3', {'data-hook': 'product-item-name'}).get_text().strip()
    brand = offer_name.split(' ')[0].capitalize()
    price = int(float(phone.find('div', {'data-hook': 'not-image-container'}).find('div', {'data-hook': "product-item-product-details"})\
        .find('span', {'data-hook': 'product-item-price-to-pay'}).get_text().strip().replace('ден', '').replace('.', '').replace(',', '.')))

    response2 = requests.get(offer_url)
    soup2 = BeautifulSoup(response2.text, 'html.parser')

    color_section = soup2.find('section', {'data-hook': 'product-colors-title-section'})

    color = None
    if color_section is not None:
        temp_colors = color_section.find('fieldset', {'class': 'ColorPickerbase3563640754__container'})\
            .find_all('input', {'type': 'radio'})
        colors_list = []
        for temp_color in temp_colors:
            colors_list.append(temp_color.get('aria-label'))
        color = ','.join(colors_list)

    rows = soup2.find('div', {'data-hook': 'info-section-description'}).find_all('li')

    if len(rows) == 0:
        rows = soup2.find('div', {'data-hook': 'info-section-description'}).find_all('tr')

    specifications = []

    for row in rows:
        specifications.append(unicodedata.normalize('NFKD', row.get_text().strip()))

    offer_description = '\n'.join(specifications)

    insert_script = 'INSERT INTO phone_offers (offer_shop, brand, offer_name , price, offer_url, ' \
                    'offer_description, last_updated, is_validated)' \
                            ' VALUES (%s, %s, %s, %s, %s, %s, %s, %s);'
    insert_value = (offer_shop, brand, offer_name, price, offer_url, offer_description,
                            last_updated, is_validated)
    cur.execute(insert_script, insert_value)
    db_connection.commit()

cur.close()
db_connection.close()