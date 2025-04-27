# app/model/rag_pipeline.py

import requests
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import uuid
import os
import openai

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
SERVER_URL = os.getenv("SERVER_URL", "http://127.0.0.1:5000")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

openai.api_key = OPENAI_API_KEY
COLLECTION_NAME = "wound_knowledge"

qdrant_client = QdrantClient(url=QDRANT_URL)

def initialize_qdrant_collection():
    """Create collection if not exists."""
    if COLLECTION_NAME not in [c.name for c in qdrant_client.get_collections().collections]:
        qdrant_client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
        )
        print(f"[QDRANT] Collection '{COLLECTION_NAME}' created.")
    else:
        print(f"[QDRANT] Collection '{COLLECTION_NAME}' already exists.")

def embed_text(text):
    """Embed text using OpenAI."""
    response = openai.Embedding.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response["data"][0]["embedding"]

def add_wound_to_qdrant(text, payload):
    """Insert wound knowledge into Qdrant."""
    vector = embed_text(text)
    point = PointStruct(
        id=str(uuid.uuid4()),
        vector=vector,
        payload=payload
    )
    qdrant_client.upsert(collection_name=COLLECTION_NAME, points=[point])

def load_wound_knowledge_from_server(username):
    """Fetch wound records from Flask and insert into Qdrant."""
    try:
        url = f"{SERVER_URL}/fetch-user-knowledge/{username}"
        res = requests.get(url)
        data = res.json()

        wound_records = data.get("wound_knowledge_base", [])

        for record in wound_records:
            text = f"Wound recorded on {record['date']} at {record['time']} with size {record['length_cm']}cm x {record['width_cm']}cm (area: {record['area_cm2']} cm²)."
            payload = {
                "date": record["date"],
                "time": record["time"],
                "length_cm": record["length_cm"],
                "width_cm": record["width_cm"],
                "area_cm2": record["area_cm2"],
                "image_url": record["image_url"]
            }
            add_wound_to_qdrant(text, payload)

        print(f"[QDRANT] Loaded {len(wound_records)} wound records into knowledge base.")
        
    except Exception as e:
        print(f"Error loading wound knowledge: {str(e)}")
