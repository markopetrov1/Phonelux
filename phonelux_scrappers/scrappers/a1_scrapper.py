import unicodedata
from datetime import datetime

import psycopg2
import config_read
from bs4 import BeautifulSoup
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

offer_shop = "A1"  # offer shop
last_updated = datetime.now().date()
is_validated = False

a1_url = 'https://www.a1.mk/webshop/mk/phones'

response1 = requests.get(a1_url)
soup1 = BeautifulSoup(response1.content, 'html.parser')

phones = soup1.find('main', {'class', 'gsm-advisor-grid phones'}).find('div', {'class', 'd-flex'}) \
    .find_all('div', {'class', 'dvc-idtfr by4'})

for phone in phones:
    brand = phone.get('data-brand').strip()
    offer_name = brand+" "+phone.get('data-model').strip()

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

    insert_script = 'INSERT INTO phone_offers (offer_shop, brand, offer_name, price, image_url, offer_url,' \
                    'ram_memory, rom_memory, battery, back_camera, front_camera, color, cpu, ' \
                    'operating_system, offer_shop_code, last_updated, is_validated)' \
                    ' VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'
    insert_value = (offer_shop, brand, offer_name, price, image_url, offer_url, ram_memory, rom_memory,
                    battery, back_camera, front_camera, color, cpu, operating_system, offer_shop_code,
                    last_updated, is_validated)
    cur.execute(insert_script, insert_value)
    db_connection.commit()

cur.close()
db_connection.close()
