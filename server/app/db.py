from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import current_app

client = None

def init_db(app):
    global client
    uri = app.config['MONGO_URI']
    print(uri)
    client = MongoClient(uri, server_api=ServerApi('1'))
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(f"MongoDB connection error: {e}")

def get_db():
    db_name = current_app.config['MONGO_DBNAME']
    return client[db_name]
