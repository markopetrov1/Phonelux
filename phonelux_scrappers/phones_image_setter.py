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
cinfo = config_read.get_databaseconfig("postgresdb.config")
db_connection = psycopg2.connect(
    database=cinfo[0],
    host=cinfo[1],
    user=cinfo[2],
    password=cinfo[3]
)
cur = db_connection.cursor()

cur.execute('SELECT * FROM PHONES ORDER BY id')

db_connection.commit()
phones = cur.fetchall()

for phone in phones:
    print(phone)
    phone_id = phone[0]
    cur.execute('SELECT phone_offers.image_url FROM phone_offers JOIN phones ON'
                ' phone_offers.phone_id = phones.id WHERE '
                'phones.id='+str(phone_id)+' AND phone_offers.image_url IS NOT NULL LIMIT 1')
    tuple_image = cur.fetchone()
    if tuple_image is not None:
        print(tuple_image[0])
        cur.execute('UPDATE phones SET image_url = \''+tuple_image[0]+'\' WHERE id='+str(phone_id));
        db_connection.commit()
    else:
        print('None');


cur.close()
db_connection.close()