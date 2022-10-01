import requests
import sys
import unicodedata
import json
from classes.phone import Phone
from classes.phoneoffer import PhoneOffer

file_path = 'outputfile.txt'
sys.stdout = open(file_path, "w")

# testing connection with spring backend app
# print(unicodedata.normalize('NFKD', str(requests.get("http://localhost:8080/phoneoffer/7").text)))

offers = json.loads(unicodedata.normalize('NFKD', requests.get('http://localhost:8080/phoneoffer/shop/a1').text))


phoneOffers = []

for offer in offers:
    phoneOffer = PhoneOffer(offer['id'], offer['offer_shop'], offer['offer_name'], offer['price'], offer['ram_memory'],
                               offer['rom_memory'], offer['color'], offer['front_camera'], offer['back_camera'],
                               offer['chipset'], offer['battery'], offer['operating_system'], offer['cpu'], offer['image_url'],
                               offer['offer_url'], offer['last_updated'], offer['is_validated'], offer['offer_description'],
                               offer['offer_shop_code'])
    phoneOffers.append(phoneOffer)

for offer in phoneOffers:
    print(offer)






