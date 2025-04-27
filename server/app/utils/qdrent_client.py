
# app/utils/qdrant_client.py

from qdrant_client import QdrantClient

# Connect to local Qdrant instance
qdrant_client = QdrantClient(host="localhost", port=6333)