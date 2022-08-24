import unicodedata
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

offer_shop = "Mobelix"  # offer shop
last_updated = datetime.now().date()
is_validated = False

for i in range(1, 17):
    mobelix_url = "https://mobelix.com.mk/mk/mobilni-telefoni?page=" + str(i)

    response1 = requests.get(mobelix_url)
    soup1 = BeautifulSoup(response1.content, 'html.parser')

    phones = soup1.find_all('div', {'class': 'p-2 rounded text-dark bg-white d-flex w-100'})

    for phone in phones:
        offer_url = phone.find('a').get('href')
        image_url = phone.find_all('div', {'class': 'col-12'})[0].find('img').get('src')
        brand = phone.find_all('div', {'class': 'col-12'})[1].find('h5', {'class': 'mb-0'}).get_text().strip()
        offer_name = phone.find_all('div', {'class': 'col-12'})[1] \
            .find('h3', {'class': 'h5 font-weight-normal'}).get_text().strip()

        if 'Watch' in offer_name or 'Pad' in offer_name or 'Tab' in offer_name or 'Pods' in offer_name or 'Buds' in offer_name or 'HomePod' in offer_name:
            continue

        if brand not in offer_name:
            offer_name = brand + " " + offer_name

        temp_prices = phone.find_all('div', {'class': 'col-12'})[1] \
            .find('p', {'class': 'h5 price'}).get_text(separator='/').strip()

        if len(temp_prices.split('/')) > 1:
            price = int(float(temp_prices.split('/')[1].replace(',', '').replace('ден', '').strip()))
        else:
            price = int(float(temp_prices.split('/')[0].replace(',', '').replace('ден', '').strip()))

        response2 = requests.get(offer_url)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        colors_divs = soup2.find('div', {'class': 'color-wrapper mt-2 mb-1'}) \
            .find_all('div', {'class': 'color-box d-inline-block'})  # color div tags

        temp_colors = []
        for div in colors_divs:
            temp_colors.append(div.get('title'))

        color = ",".join(temp_colors)  # available colors for offer

        tables = soup2.find('div', {'class': 'mobelix-specs table-white bordered-table'}).find_all('table')

        operating_system = None
        chipset = None
        battery = None
        ram_memory = None
        rom_memory = None
        front_camera = ''
        back_camera = ''
        cpu = None

        for table in tables:
            for cell in table.find_all('td'):
                if cell.get('data-spec') is None:
                    continue

                if cell.get('data-spec') == 'os':
                    operating_system = unicodedata.normalize('NFKD', cell.get_text().strip())

                if cell.get('data-spec') == 'chipset':
                    chipset = unicodedata.normalize('NFKD', cell.get_text().strip())

                if cell.get('data-spec') == 'cpu':
                    cpu = unicodedata.normalize('NFKD', cell.get_text().strip())

                if cell.get('data-spec') == 'internalmemory':
                    temp_rom = []
                    temp_ram = []
                    temp_internalmemory = unicodedata.normalize('NFKD', cell.get_text().strip())
                    for internalmemory in temp_internalmemory.split(','):
                        temp_rom.append(internalmemory.strip().split(' ')[0])
                        if len(internalmemory.strip().split(' ')) > 1:
                            temp_ram.append(internalmemory.strip().split(' ')[1])
                    rom_memory = ','.join(temp_rom)
                    ram_memory = ','.join(temp_ram)

                if cell.get('data-spec') == 'cam1modules' or cell.get('data-spec') == 'cam1features' or cell.get(
                        'data-spec') == 'cam1video':
                    back_camera += unicodedata.normalize('NFKD', cell.get_text().strip()) + '\n'

                if cell.get('data-spec') == 'cam2modules' or cell.get('data-spec') == 'cam2features' or cell.get(
                        'data-spec') == 'cam2video':
                    front_camera += unicodedata.normalize('NFKD', cell.get_text().strip()) + '\n'

                if cell.get('data-spec') == 'batdescription1':
                    battery = unicodedata.normalize('NFKD', cell.get_text().strip())

        if front_camera == 'No':
            front_camera = None

        if back_camera == 'No':
            back_camera = None

        insert_script = 'INSERT INTO phone_offers (offer_shop, brand, offer_name, price, image_url, offer_url,' \
                        'ram_memory, rom_memory, battery, back_camera, front_camera, color, cpu, chipset, ' \
                        'operating_system, last_updated, is_validated)' \
                        ' VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'
        insert_value = (offer_shop, brand, offer_name, price, image_url, offer_url, ram_memory, rom_memory,
                        battery, back_camera, front_camera, color, cpu, chipset, operating_system,
                        last_updated, is_validated)
        cur.execute(insert_script, insert_value)
        db_connection.commit()

cur.close()
db_connection.close()
