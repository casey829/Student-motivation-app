from server import create_app
from server.extensions import db

# Create the Flask application
app = create_app()
db.init_app(app)
# Ensure that the app context is pushed before calling db.create_all()
with app.app_context():
    db.create_all()  # Creates tables based on models
