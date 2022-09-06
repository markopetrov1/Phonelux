
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

cur.execute('SELECT id, model FROM phones;')
phones = cur.fetchall()

for phone in phones:
    cur.execute('SELECT COUNT(*) FROM phone_offers WHERE phone_id='+str(phone[0])+';')

    total_offers = cur.fetchone()[0]

    cur.execute('UPDATE phones SET total_offers='+str(total_offers)+' WHERE id='+str(phone[0])+';')
    db_connection.commit()


cur.close()
db_connection.close()