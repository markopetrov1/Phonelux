from datetime import datetime

import psycopg2
import config_read
from bs4 import BeautifulSoup
import requests
import unicodedata
import sys

# file_path = '../outputfile.txt'
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

offer_shop = "Akcija"  # offer shop
last_updated = datetime.now().date()
is_validated = False

i = 0
while i <= 20:
    akcija_url = "https://akcija.com.mk/listing/" + str(i) + "?category=mobilnitelefoni"
    response1 = requests.get(akcija_url)
    response1.encoding = 'utf-8'
    soup1 = BeautifulSoup(response1.text, 'html.parser')

    phones = soup1.find_all('div', {'class', 'product-item__body pb-xl-2'})

    for phone in phones:
        offer_name = phone.find('h5', {'class': 'mb-1 product-item__title'}).find('a') \
            .get_text().replace('Паметен телефон', '').strip()
        brand = offer_name.split(' ')[0]

        if brand not in offer_name:
            offer_name = brand + " " + offer_name

        offer_url = phone.find('h5', {'class': 'mb-1 product-item__title'}).find('a').get('href')
        image_url = phone.find('div', {'class', 'mb-2'}).find('img').get('src')
        price = int(phone.find('div', {'class', 'flex-center-between mb-1 pt-xl-2'}) \
                    .find('ins').get_text().split(' ')[0].strip())

        response2 = requests.get(offer_url)
        response2.encoding = 'utf-8'
        soup2 = BeautifulSoup(response2.text, 'html.parser')

        specifications = soup2.find('main', {'id': 'content'}) \
            .find_all('div', {'class', 'container'})[1].find('div', {'class', 'mb-14'}) \
            .find('div', {'class', 'col-md-6 col-lg-4 col-xl-4 mb-md-6 mb-lg-0'}).find_all('p')

        offer_description = ''
        for specification in specifications:
            if 'Код за нарачка' in str(specification.get_text(separator='\n').replace('NBSP', '').strip()):
                continue
            offer_description += unicodedata.normalize('NFKD',
                                                       str(specification.get_text(separator='\n').strip())) + "\n"

        insert_script = 'INSERT INTO phone_offers (offer_shop, brand,' \
                        ' offer_name, price, image_url, offer_url, last_updated, is_validated, offer_description) ' \
                        'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);'
        insert_value = (offer_shop, brand, offer_name, price, image_url, offer_url,
                        last_updated, is_validated, offer_description)
        cur.execute(insert_script, insert_value)
        db_connection.commit()
    i += 20

cur.close()
db_connection.close()
