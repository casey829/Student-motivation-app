from flask import Flask, Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token
from datetime import datetime, timedelta
from models import User
from schemas import UserSchema
import re

app = Flask(__name__)

# Configure your database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://moringa_user:Brian_6534@localhost/moringa_platform_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure JWT
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this to a strong secret key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)  # Set the token expiration time

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

bp = Blueprint('auth', __name__, url_prefix='/auth')

def validate_password(password):
    if password == "1234":
        return False, "Password cannot be '1234'"
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one digit"
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"
    return True, "Password is valid"

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'password' not in data or 'username' not in data or 'email' not in data or 'role' not in data:
        return jsonify({"error": "Invalid request payload"}), 400

    password = data['password']
    is_valid, message = validate_password(password)
    if not is_valid:
        return jsonify({"error": message}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password,
        role=data['role'],
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.session.add(new_user)
    db.session.commit()
    return UserSchema().jsonify(new_user), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Invalid request payload"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token)
    return jsonify({"error": "Invalid credentials"}), 401

# Register Blueprint
app.register_blueprint(bp)

if __name__ == '__main__':
    app.run(debug=True)
