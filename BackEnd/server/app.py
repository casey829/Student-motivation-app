from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required,  get_jwt
from datetime import timedelta
from flask_babelex import Domain
from flask_cors import CORS
from flask_restful import Api, Resource
import random



app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:database@localhost:5432/techstudy"
app.config["JWT_SECRET_KEY"] = "fsbdgfnhgvjnvhmvh"
app.config["SECRET_KEY"] = "JKSRVHJVFBSRDFV"

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

from models import User, Role, Video, Audio, Article, Comment,db
migrate = Migrate(app, db)
db.init_app(app)


#Routes
@jwt_required()
def load_user():
    user_id = get_jwt_identity()
    if user_id:
        return User.query.get(user_id)
    return None

@app.before_request
def check_if_logged_in():
    public = ['index', 'signup', 'login', 'check_session', 'logout', 'about']
    if request.endpoint not in public and  not  load_user():
        return jsonify({"message": "Unauthorized"}), 401
#Homepage Routes
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message":"Welcome to TechStudy"}), 200

# Define the User resource for sign-up (POST /users)
class UserSignUp(Resource):
    def post(self):
        data = request.get_json()
        user_type = data.get('user_type')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if user_type == 'student':
            new_user = User(username=username, email=email, password_hash=bcrypt.generate_password_hash(password).decode('utf-8'))
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'success': 'Student has been created successfully'}), 201
        elif user_type == 'staff':
            new_user = User(username=username, email=email, password_hash=bcrypt.generate_password_hash(password).decode('utf-8'))
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'success': 'Staff has been created successfully'}), 201
        else:
            return jsonify({'error': 'Invalid user type'}), 400
# Define the Login resource (POST /auth/login)
class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter_by(email=email).first()
        
        if user and bcrypt.check_password_hash(user.password_hash, password):
            access_token = create_access_token(identity=user.id)
            return jsonify({"access_token": access_token})
        else:
            return jsonify({"message": "Invalid email or password"}), 401

# Define the About resource (GET /about)
class About(Resource):
    def get(self):
        return jsonify({"message": "About Us: Information about the application..."})

# Define the Admin Dashboard resource (GET /admin/dashboard)
class AdminDashboard(Resource):
    def get(self):
        return jsonify({"message": "Admin Dashboard"}), 200

# Adding the resources to the API
api.add_resource(UserSignUp, '/users')           # POST /users
api.add_resource(UserLogin, '/auth/login')       # POST /auth/login
api.add_resource(About, '/about')                # GET /about
api.add_resource(AdminDashboard, '/admin/dashboard')  # GET /admin/dashboard


if __name__ == '__main__':
    app.run(debug=True)