import json


class PhoneOffer:

    def __init__(self, *args):
        if len(args) == 19:
            self.offer_id = args[0]
            self.offer_shop = args[1]
            self.offer_name = args[2]
            self.price = args[3]
            self.ram_memory = args[4]
            self.rom_memory = args[5]
            self.color = args[6]
            self.front_camera = args[7]
            self.back_camera = args[8]
            self.chipset = args[9]
            self.battery = args[10]
            self.operating_system = args[11]
            self.cpu = args[12]
            self.image_url = args[13]
            self.offer_url = args[14]
            self.last_updated = args[15]
            self.is_validated = args[16]
            self.offer_description = args[17]
            self.offer_shop_code = args[18]

        if len(args) == 18:
            self.offer_shop = args[0]
            self.offer_name = args[1]
            self.price = args[2]
            self.ram_memory = args[3]
            self.rom_memory = args[4]
            self.color = args[5]
            self.front_camera = args[6]
            self.back_camera = args[7]
            self.chipset = args[8]
            self.battery = args[9]
            self.operating_system = args[10]
            self.cpu = args[11]
            self.image_url = args[12]
            self.offer_url = args[13]
            self.last_updated = args[14]
            self.is_validated = args[15]
            self.offer_description = args[16]
            self.offer_shop_code = args[17]

    def __str__(self):
        return str(self.__dict__)

