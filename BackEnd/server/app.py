from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_cors import CORS
from flask_restful import Api, Resource
from models import User, Category, Article, Video, Audio, Comment, db

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:database@localhost:5432/techstudy"
app.config["JWT_SECRET_KEY"] = "fsbdgfnhgvjnvhmvh"
app.config["SECRET_KEY"] = "JKSRVHJVFBSRDFV"

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
api = Api(app)

migrate = Migrate(app, db)
db.init_app(app)

# Utility function to load the current user based on JWT
def load_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)

# Homepage Routes
class HomePage(Resource):
    def get(self):
        return jsonify({"message": "Welcome to TechStudy"}), 200

# Define the User resource for sign-up (POST /users)
class UserSignUp(Resource):
    def post(self):
        data = request.get_json()
        user_type = data.get('user_type')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if user_type not in ['student', 'staff']:
            return jsonify({'error': 'Invalid user type'}), 400

        new_user = User(
            username=username,
            email=email,
            password_hash=bcrypt.generate_password_hash(password).decode('utf-8'),
            role=user_type
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'success': f'{user_type.capitalize()} has been created successfully'}), 201
# Define the Login resource (POST /auth/login)
class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter_by(email=email).first()

        if user and bcrypt.check_password_hash(user.password_hash, password):
            access_token = create_access_token(identity=user.id)
            return jsonify({"access_token": access_token}), 200
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

# Define the Staff Dashboard resource (GET /staff/dashboard)
class StaffDashboard(Resource):
    def get(self):
        return jsonify({"message": "Staff Dashboard"}), 200

# Define the Student Dashboard resource (GET /student/dashboard)
class StudentDashboard(Resource):
    def get(self):
        return jsonify({"message": "Student Dashboard"}), 200

# Define the User Profile resource (GET /profile)
class UserProfile(Resource):

    @jwt_required()
    def get(self):
        user = load_user()
        if user:
            return jsonify(user.to_dict()), 200
        else:
            return jsonify({"message": "User not found"}), 404

# Define the Logout resource (GET /logout)
class Logout(Resource):
    def get(self):
        return jsonify({"message": "Logout successful"}), 200
    

class CreateCategory(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or not user.is_staff:
            return jsonify({"message": "Unauthorized"}), 401

        data = request.get_json()
        name = data.get('name')
        description = data.get('description')

        if Category.query.filter_by(name=name).first():
            return jsonify({"message": "Category already exists"}), 400
        
        new_category = Category(name=name, description=description)
        db.session.add(new_category)
        db.session.commit()
        return jsonify({"message": "Category created successfully"}), 201
    
# Define the Subscribe Category resource (POST /subscribe)
class SubscribeCategory(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        category_name = data.get('category_name')

        category = Category.query.filter_by(name=category_name).first()
        if not category:
            return jsonify({"message": "Category not found"}), 404
        
        user = User.query.get(user_id)
        if category in user.subscriptions:
            return jsonify({"message": "Category already subscribed"}), 400

        user.subscriptions.append(category)
        db.session.commit()
        return jsonify({"message": "Category subscribed successfully"}), 200

# Adding the resources to the API
api.add_resource(HomePage, '/homepage')          # GET /homepage
api.add_resource(UserSignUp, '/users')            # POST /users
api.add_resource(UserLogin, '/auth/login')        # POST /auth/login
api.add_resource(About, '/about')                 # GET /about
api.add_resource(AdminDashboard, '/admin/dashboard')  # GET /admin/dashboard
api.add_resource(StaffDashboard, '/staff/dashboard')  # GET /staff/dashboard
api.add_resource(StudentDashboard, '/student/dashboard')  # GET /student/dashboard
api.add_resource(UserProfile, '/profile')  # GET /profile
api.add_resource(Logout, '/logout')  # GET /logout
api.add_resource(CreateCategory, '/create/category')  # POST /create/category
api.add_resource(SubscribeCategory, '/subscribe/category')  # POST /subscribe/category

if __name__ == '__main__':
    app.run(debug=True)
