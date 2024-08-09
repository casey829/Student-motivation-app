from flask import Blueprint, request, jsonify, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from server.extensions import db
from server.models import User, Role, Video, Audio, Article, Comment

main = Blueprint('main', __name__)
@main.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Welcome to the Tech Study App! Please visit /homepage to continue."
    }), 200


@main.route('/homepage', methods=['GET'])
def homepage():
    role = request.args.get('role')
    if role:
        if role not in ['admin', 'staff', 'student']:
            return jsonify({"error": "Invalid role selected. Please choose 'admin', 'staff', or 'student'."}), 400
        return redirect(url_for(f'signup_{role}'))
    return jsonify({
        "message": "Welcome to the Tech Study App! Please select your role by providing a query parameter: '?role=admin', '?role=staff', or '?role=student'."
    }), 200

@main.route('/signup/<role>', methods=['POST'])
def signup(role):
    if role not in ['admin', 'staff', 'student']:
        return jsonify({"error": "Invalid role. Use 'admin', 'staff', or 'student'."}), 400

    data = request.get_json()
    if not all(key in data for key in ('username', 'email', 'password')):
        return jsonify({"error": "Missing required fields"}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password, role=role)
    db.session.add(new_user)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    
    return jsonify({"message": f"{role.capitalize()} account created successfully"}), 201

@main.route('/login/<role>', methods=['POST'])
def login_role(role):
    if role not in ['admin', 'staff', 'student']:
        return jsonify({"error": "Invalid role. Use 'admin', 'staff', or 'student'."}), 400
    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    user = User.query.filter_by(username=username, role=role).first()
    if user and check_password_hash(user.password_hash, password):
        session['user_id'] = user.id
        session['role'] = role
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@main.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    session.pop('role', None)
    return jsonify({"message": "Logout successful"}), 200

# Error handling
@main.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Page not found"}), 404

@main.errorhandler(500)
def internal_server_error(e):
    return jsonify({"error": "Internal server error"}), 500
