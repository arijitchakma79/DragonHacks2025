# app/utils/embedder.py

from sentence_transformers import SentenceTransformer

# Initialize embedding model once
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')  # small, fast model

def generate_embedding(text):
    """
    Generate embedding vector for a given text.
    """
    return embedding_model.encode(text).tolist()