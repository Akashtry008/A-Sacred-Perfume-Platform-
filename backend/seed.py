import os
import json
from database import get_sync_db

def seed_database():
    store_json_path = os.path.join(os.path.dirname(__file__), "..", "data", "store.json")
    if not os.path.exists(store_json_path):
        print(f"Error: {store_json_path} does not exist.")
        return

    with open(store_json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    sync_db = get_sync_db()

    # 1. Products
    products = data.get("products", [])
    if products:
        sync_db["products"].delete_many({})
        sync_db["products"].insert_many(products)
        print(f"[OK] Seeded {len(products)} products into MongoDB")

    # 2. Collections
    collections = data.get("collections", [])
    if collections:
        sync_db["collections"].delete_many({})
        sync_db["collections"].insert_many(collections)
        print(f"[OK] Seeded {len(collections)} collections into MongoDB")

    # 3. Orders
    orders = data.get("orders", [])
    if orders:
        sync_db["orders"].delete_many({})
        sync_db["orders"].insert_many(orders)
        print(f"[OK] Seeded {len(orders)} orders into MongoDB")

    # 4. Coupons
    coupons = data.get("coupons", [])
    if coupons:
        sync_db["coupons"].delete_many({})
        sync_db["coupons"].insert_many(coupons)
        print(f"[OK] Seeded {len(coupons)} coupons into MongoDB")

    # 5. Reviews
    reviews = data.get("reviews", [])
    if reviews:
        sync_db["reviews"].delete_many({})
        sync_db["reviews"].insert_many(reviews)
        print(f"[OK] Seeded {len(reviews)} reviews into MongoDB")

    # 6. FAQs
    faqs = data.get("faqs", [])
    if faqs:
        sync_db["faqs"].delete_many({})
        sync_db["faqs"].insert_many(faqs)
        print(f"[OK] Seeded {len(faqs)} FAQs into MongoDB")

    # 7. Blogs
    blogs = data.get("blogs", [])
    if blogs:
        sync_db["blogs"].delete_many({})
        sync_db["blogs"].insert_many(blogs)
        print(f"[OK] Seeded {len(blogs)} blogs into MongoDB")

    # 8. Banners & Homepage Sections
    homepage_sections = data.get("homepageSections", [])
    hero_section = next((s for s in homepage_sections if s.get("type") == "HERO_SLIDER"), None)
    promo_section = next((s for s in homepage_sections if s.get("type") == "PROMO_BANNER"), None)

    if hero_section and "slides" in hero_section.get("content", {}):
        slides = hero_section["content"]["slides"]
        sync_db["banners"].delete_many({})
        for idx, slide in enumerate(slides):
            slide["sortOrder"] = idx
            sync_db["banners"].insert_one(slide)
        print(f"[OK] Seeded {len(slides)} hero slides into MongoDB")

    if promo_section:
        sync_db["promo_banner"].delete_many({})
        sync_db["promo_banner"].insert_one(promo_section.get("content", {}))
        print("[OK] Seeded promo hamper banner into MongoDB")

    # 9. Users & Authentication
    users = data.get("users", [])
    if users:
        sync_db["users"].delete_many({})
        sync_db["users"].insert_many(users)
        print(f"[OK] Seeded {len(users)} users into MongoDB")

    # 10. Create indexes for performance
    sync_db["products"].create_index("slug", unique=True)
    sync_db["products"].create_index("id", unique=True)
    sync_db["collections"].create_index("slug", unique=True)
    sync_db["orders"].create_index("orderNumber", unique=True)
    sync_db["coupons"].create_index("code", unique=True)
    sync_db["blogs"].create_index("slug", unique=True)
    sync_db["users"].create_index("email", unique=True)

    print("\nMongoDB Database Seeded Successfully with VedaPavitra Storefront & User Data!")

if __name__ == "__main__":
    seed_database()
