from datetime import datetime

import psycopg2
import config_read
from bs4 import BeautifulSoup
import requests

# import sys
# file_path = 'outputfile.txt'
# sys.stdout = open(file_path, "w")

# Call to read the configuration file and connect to database
cinfo = config_read.get_databaseconfig("../postgresdb.config")
db_connection = psycopg2.connect(
    database=cinfo[0],
    host=cinfo[1],
    user=cinfo[2],
    password=cinfo[3]
)
cur = db_connection.cursor()

mobitech_url = "https://mobitech.mk/shop/"

response1 = requests.get(mobitech_url)

soup1 = BeautifulSoup(response1.content, 'html.parser')

phones = soup1.find_all('div', {'class': 'jet-woo-products__inner-box'})

offer_shop = "Mobitech"  # offer shop
is_validated = False

for phone in phones:
    offer_url = phone.find('h5', {'class': 'jet-woo-product-title'}).find('a').get('href')  # url
    image_url = phone.find('div', {'class': 'jet-woo-product-thumbnail'}).find('img').get('src')  # image
    brand = phone.find_next('div', {'class': 'jet-woo-product-categories'}).find('a').get_text().strip()  # brand
    offer_name = phone.find('h5', {'class': 'jet-woo-product-title'}).find('a').get_text().strip()  # offer_name
    if brand not in offer_name:
        offer_name = brand+" "+offer_name
    temp_prices = phone.find('div', {'class': 'jet-woo-product-price'}).find_all('bdi')
    price = int(float(temp_prices[len(temp_prices) - 1].get_text().replace("ден", "").replace(",", "").strip())) # price
    last_updated = datetime.now().date()  # offer last_updated date

    response2 = requests.get(offer_url)
    soup2 = BeautifulSoup(response2.content, 'html.parser')

    specifications = soup2.find_all('h2', {'class': 'elementor-heading-title elementor-size-default'})

    ram_memory = ""
    rom_memory = ""
    battery = ""
    back_camera = ""
    operating_system = ""

    for specification in specifications:
        # rom memory
        if specification.get_text().startswith("Меморија:"):
            rom_memory = specification.get_text().split("Меморија:")[1].strip()
            if rom_memory == "Нема" or rom_memory == "/":
                rom_memory = None

        # ram memory
        if specification.get_text().startswith("РАМ Меморија:"):
            ram_memory = specification.get_text().split("РАМ Меморија:")[1].strip()
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

    insert_script = 'INSERT INTO phone_offers (offer_shop, brand, offer_name, price, image_url, offer_url, ram_memory,' \
                    ' rom_memory, battery, back_camera, last_updated, operating_system, is_validated)' \
                    ' VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'
    insert_value = (offer_shop, brand, offer_name, price, image_url, offer_url, ram_memory,
                    rom_memory, battery, back_camera, last_updated, operating_system, is_validated)
    cur.execute(insert_script, insert_value)
    db_connection.commit()

cur.close()
db_connection.close()
