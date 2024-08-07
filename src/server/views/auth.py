from flask import Blueprint, request, jsonify # type: ignore
from models import User
from app import db, bcrypt
from flask_jwt_extended import create_access_token # type: ignore
from datetime import datetime
from schemas import UserSchema
import re

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
