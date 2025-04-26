from app import app

@app.route('/')
def home():
    return "Hello from clean Flask structure!"
