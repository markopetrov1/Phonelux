
import psycopg2
import config_read

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

cur.execute('SELECT id,model FROM phones ORDER BY id;')

phones = cur.fetchall()

for phone in phones:
    phone_id = str(phone[0])
    print('id: '+phone_id)
    cur.execute('SELECT offer_name,price FROM phone_offers WHERE phone_id=' + phone_id + ' ORDER BY price;')
    details = cur.fetchone()
    lowestPrice = None

    if details is not None:
        lowestPrice = details[1]
        cur.execute('UPDATE phones SET lowest_price='+str(lowestPrice)+' WHERE id='+phone_id+';')
        db_connection.commit()

cur.close()
db_connection.close()
