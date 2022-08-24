from datetime import datetime

import psycopg2
import config_read
from bs4 import BeautifulSoup
import requests

# import sys
#
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

offer_shop = "Mobi Go"  # offer shop
last_updated = datetime.now().date()
is_validated = False
for i in range(1, 6):
    mobigo_url = "https://mobigo.mk/page/" + str(i) + "/"

    response1 = requests.get(mobigo_url)

    soup1 = BeautifulSoup(response1.content, 'html.parser')

    phone_sections = soup1.find_all('ul', {'class': 'recent-posts'})
    phones = phone_sections[len(phone_sections) - 1].find_all('li')

    for phone in phones:
        offer_url = phone.find('div', {'class', 'post-thumb'}).find('a').get('href')  # offer url
        image_url = phone.find('div', {'class', 'post-thumb'}).find('a').find('img').get('src')  # image url
        offer_name = phone.find('div', {'class', 'post-content'}).find_all('h2')[0].get_text().strip()  # offer_name

        if "Watch" in offer_name or "Tab" in offer_name:  # if the product is watch or tablet, continue
            continue

        price = int(float(phone.find('div', {'class', 'post-content'}).find_all('h2')[1] \
                          .get_text().replace('ден.', '').replace('.', '').strip()))  # price

        response2 = requests.get(offer_url)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        brand = soup2.find('a', {'rel': 'category tag'}).get_text().strip()  # brand

        if brand not in offer_name:
            offer_name = brand + " " + offer_name

        specifications = soup2.find('table', {'id': 'singlet'}).find_all('tr')

        ram_memory = ""
        rom_memory = ""
        battery = ""
        back_camera = ""
        front_camera = ""
        chipset = ""
        operating_system = ""

        for specification in specifications:
            if specification.find('td') == None:
                continue

            # operating system
            if specification.find('td').get_text() == "Платформа":
                if specification.find('i').get_text() != "/":
                    operating_system = specification.find('i').get_text().strip()
                else:
                    operating_system = None

            # chipset
            if specification.find('td').get_text() == "Chipset":
                if specification.find('i').get_text() != "/":
                    chipset = specification.find('i').get_text().strip()
                else:
                    chipset = None

            # ram and rom memory
            if specification.find('td').get_text() == "Меморија":
                if specification.find('i').get_text() != "/":
                    rom_memory = specification.find('i').get_text().replace(',', '').split(' ')[0].strip()
                    ram_memory = specification.find('i').get_text().replace(',', '').split(' ')[1].strip()
                else:
                    rom_memory = None
                    ram_memory = None

            # back camera
            if specification.find('td').get_text() == "Главна Камера":
                if specification.find('i').get_text() != "/":
                    back_camera = specification.find('i').get_text().strip()
                else:
                    back_camera = None

            # front camera
            if specification.find('td').get_text() == "Селфи Камера":
                if specification.find('i').get_text() != "/":
                    front_camera = specification.find('i').get_text().strip()
                else:
                    front_camera = None

            # battery
            if specification.find('td').get_text() == "Батерија":
                if specification.find('i').get_text() != "/":
                    battery = specification.find('i').get_text().strip()
                else:
                    battery = None

        insert_script = 'INSERT INTO phone_offers (offer_shop, brand, offer_name, price, image_url, offer_url, ram_memory,' \
                        ' rom_memory, battery, back_camera, front_camera, chipset, operating_system, last_updated, is_validated)' \
                        ' VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'
        insert_value = (offer_shop, brand, offer_name, price, image_url, offer_url, ram_memory,
                        rom_memory, battery, back_camera, front_camera, chipset, operating_system, last_updated, is_validated)
        cur.execute(insert_script, insert_value)
        db_connection.commit()

cur.close()
db_connection.close()
