import configparser

def get_databaseconfig(filename):
    cf = configparser.ConfigParser()
    cf.read(filename)  # Read configuration file
    # Read corresponding file parameters
    _database = cf.get("Database1", "database")
    _host = cf.get("Database1", "hostname")
    _username = cf.get("Database1", "username")
    _pwd = cf.get("Database1", "pwd")
    return _database, _host, _username, _pwd  # return required parameters