from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('server.config.Config')
    print("Configuration loaded:", app.config['SQLALCHEMY_DATABASE_URI'])  # Debug line

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    from server.routes import main
    app.register_blueprint(main)
    
    return app
