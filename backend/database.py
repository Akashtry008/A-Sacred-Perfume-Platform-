import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from motor.motor_asyncio import AsyncIOMotorClient
import pymongo

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "vedapavitra_db")

# Async Motor Client for FastAPI routes
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Collections
products_col = db["products"]
collections_col = db["collections"]
orders_col = db["orders"]
payments_col = db["payments"]
banners_col = db["banners"]
promo_banner_col = db["promo_banner"]
seasonal_banners_col = db["seasonal_banners"]
reviews_col = db["reviews"]
coupons_col = db["coupons"]
inquiries_col = db["inquiries"]
newsletter_col = db["newsletter"]
settings_col = db["settings"]
diya_showcase_col = db["diya_showcase"]
faqs_col = db["faqs"]
blogs_col = db["blogs"]
carts_col = db["carts"]
users_col = db["users"]
activities_col = db["activities"]
email_logs_col = db["email_logs"]
reset_codes_col = db["reset_codes"]
sections_col = db["sections"]
policies_col = db["policies"]

def get_sync_db():
    sync_client = pymongo.MongoClient(MONGO_URI)
    return sync_client[DB_NAME]
