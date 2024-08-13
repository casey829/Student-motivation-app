from flask import Flask, request, jsonify,send_file
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from io import BytesIO
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_restful import Api, Resource
from models import db, User, Category, Article, Video, Audio, Comment, BlacklistedToken, UserContentAction
import traceback
import base64

app = Flask(__name__)
CORS(app)  # Configuring CORS

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:database@localhost:5432/techstudy"
app.config["JWT_SECRET_KEY"] = "fsbdgfnhgvjnvhmvh"
app.config["SECRET_KEY"] = "JKSRVHJVFBSRDFV"

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
api = Api(app)

migrate = Migrate(app, db)
db.init_app(app)


# user_id = get_jwt_identity()
# Homepage Routes

# Home Page
@app.route('/homepage', methods=['GET']) #works fine
def home_page():
    return jsonify({"message": "Welcome to TechStudy"}), 200


# User Sign Up
@app.route('/users', methods=['POST']) #works fine
def user_sign_up():
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

# User Login
@app.route('/login', methods=['POST']) #works fine
def user_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    
    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

# About Page
@app.route('/about', methods=['GET'])#works fine
def about():
    return jsonify({"message": "About Us: Information about the application..."})
# Admin Dashboard
@app.route('/admin/dashboard', methods=['GET'])
@jwt_required()
def admin_dashboard():
    user_id = get_jwt_identity()  # Get the user ID from the token
    user = db.session.get(User, user_id)  # Fetch the user from the database

    if user and user.role.name == 'Admin':  # Check if the user is an admin
        return jsonify({"message": "Admin Dashboard"}), 200
    else:
        return jsonify({"error": "Unauthorized access"}), 403  # Forbidden if not admin

# Staff Dashboard
@app.route('/staff/dashboard', methods=['GET'])
@jwt_required()
def staff_dashboard():
    user_id = get_jwt_identity()  # Get the user ID from the token
    user = db.session.get(User, user_id)  # Fetch the user from the database

    if user and user.role.name == 'Staff':  # Check if the user is a staff member
        return jsonify({"message": "Staff Dashboard"}), 200
    else:
        return jsonify({"error": "Unauthorized access"}), 403  # Forbidden if not staff
    

# Student Dashboard
@app.route('/student/dashboard', methods=['GET'])
@jwt_required()
def student_dashboard():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user and user.role.name == 'Student':
        return jsonify({"message": "Student Dashboard"}), 200
    else:
        return jsonify({"error": "Unauthorized access"}), 403

# User Profile
@app.route('/profile', methods=['GET'])
@jwt_required()
def user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({"message": "User not found"}), 404

# Logout
@app.route('/logout', methods=['POST']) #works fine
@jwt_required()
def logout():
    try:
        # Get the JWT token from the request
        auth_header = request.headers.get('Authorization')
        if auth_header:
            jwt_token = auth_header.split(" ")[1]  # Assuming Bearer token
        else:
            return jsonify({"error": "Authorization header is missing"}), 401

        # Get the user ID from the token
        user_id = get_jwt_identity()

        # Blacklist the token
        blacklisted_token = BlacklistedToken(token=jwt_token)
        db.session.add(blacklisted_token)

        # Deactivate the user
        user = db.session.get(User, user_id)
        if user:
            user.active = False
            db.session.add(user)

        db.session.commit()

        return jsonify({"message": "Logout successful", "redirect": "/"}), 200
    except Exception as e:
        db.session.rollback()
        traceback_str = traceback.format_exc()
        print(f"An error occurred: {traceback_str}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
# Create Category
@app.route('/create/category', methods=['POST']) #works fine
@jwt_required()
def create_category():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user is None or user.role not in ['staff', 'admin']:
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

# Subscribe Category
@app.route('/subscribe/category', methods=['POST']) #works fine
@jwt_required()
def subscribe_category():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"message": "Unauthorized"}), 401

    if user.role != 'student':
        return jsonify({"message": "Only students can subscribe to categories"}), 403

    data = request.get_json()
    category_name = data.get('category_name')
    
    category = Category.query.filter_by(name=category_name).first()
    if not category:
        return jsonify({"message": "Category not found"}), 404
    
    if category in user.categories:
        return jsonify({"message": "Category already subscribed"}), 400

    user.categories.append(category)
    db.session.commit()
    return jsonify({"message": "Category subscribed successfully"}), 200
# Upload Content

@app.route('/upload/<string:content_type>', methods=['POST'])
@jwt_required()
def upload_content(content_type):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user is None :
        return jsonify({"message": "Unauthorized"}), 401
    
    if content_type not in ['video', 'audio', 'article']:
        return jsonify({"error": "Invalid content type"}), 400

    try:
        data = request.get_json()

        if content_type in ['video', 'audio']:
            file_data_base64 = data.get('file')
            title = data.get('title')

            if not file_data_base64 or not title:
                return jsonify({"error": "File data and title are required"}), 400

            # Decode the base64 file data
            file_data = base64.b64decode(file_data_base64)
            filename = "uploaded_file"  # You can generate a unique filename if needed

            max_size = 100 * 1024 * 1024 if content_type == 'video' else 50 * 1024 * 1024
            if len(file_data) > max_size:
                return jsonify({"error": f"File size exceeds the {max_size / (1024 * 1024)} MB limit"}), 400

            if content_type == 'video':
                new_content = Video(
                    filename=filename,
                    file_data=file_data,
                    description=title,
                    user_id=user_id,
                )
            else:
                new_content = Audio(
                    filename=filename,
                    file_data=file_data,
                    description=title,
                    user_id=user_id,
                )

            db.session.add(new_content)
            db.session.commit()
            return jsonify({"success": f"{content_type.capitalize()} uploaded successfully"}), 201

        elif content_type == 'article':
            content_text = data.get('content')
            title = data.get('title')

            if not content_text or not title:
                return jsonify({"error": "Title and content are required"}), 400

            if len(content_text) > 5000:
                return jsonify({"error": "Content exceeds the 5000 character limit"}), 400

            new_content = Article(
                title=title,
                content=content_text,
                user_id=user_id,
            )
            db.session.add(new_content)
            db.session.commit()
            return jsonify({"success": "Article uploaded successfully"}), 201

    except Exception as e:
        db.session.rollback()
        # Log the traceback for more details
        traceback_str = traceback.format_exc()
        print(f"An error occurred: {traceback_str}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
# Get Content
@app.route('/content/<string:content_type>/<int:content_id>', methods=['GET'])
@jwt_required()
def get_content(content_type, content_id):
    try:
        if content_type == 'video':
            content = Video.query.get_or_404(content_id)
            return send_file(
                BytesIO(content.file_data),
                mimetype='video/mp4',
                as_attachment=True,
                download_name=f"{content.title}.mp4"
            )

        elif content_type == 'audio':
            content = Audio.query.get_or_404(content_id)
            return send_file(
                BytesIO(content.file_data),
                mimetype='audio/mpeg',
                as_attachment=True,
                download_name=f"{content.title}.mp3"
            )

        elif content_type == 'article':
            content = Article.query.get_or_404(content_id)
            return jsonify({
                "title": content.title,
                "content": content.content_text,
                "author_id": content.user_id,
                "created_at": content.created_at
            }), 200

        else:
            return jsonify({"error": "Invalid content type"}), 400

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Comment Resource
@app.route('/<string:content_type>/<int:content_id>/comments', methods=['POST'])
@jwt_required()
def post_comment(content_type, content_id):
    user_id = get_jwt_identity()
    text = request.json.get('text')

    if content_type not in ['video', 'audio', 'article']:
        return jsonify({"error": "Invalid content type"}), 400

    if not content_id or not text:
        return jsonify({"error": "Content ID and text are required"}), 400

    try:
        if content_type == 'video':
            content = Video.query.get(content_id)
        elif content_type == 'audio':
            content = Audio.query.get(content_id)
        elif content_type == 'article':
            content = Article.query.get(content_id)

        if not content:
            return jsonify({"error": "Content not found"}), 404

        new_comment = Comment(
            content_id=content_id,
            content_type=content_type,
            text=text,
            user_id=user_id,
            parent_id=None
        )
        db.session.add(new_comment)
        db.session.commit()
        return jsonify({"success": "Comment posted successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Like/Dislike Content
@app.route('/<string:content_type>/<int:content_id>/like', methods=['POST'])
@jwt_required()
def like_content(content_type, content_id):
    user_id = get_jwt_identity()

    if content_type not in ['video', 'audio', 'article']:
        return jsonify({"error": "Invalid content type"}), 400

    try:
        # Retrieve the content based on the content type
        if content_type == 'video':
            content = Video.query.get(content_id)
        elif content_type == 'audio':
            content = Audio.query.get(content_id)
        elif content_type == 'article':
            content = Article.query.get(content_id)

        if not content:
            return jsonify({"error": "Content not found"}), 404

        # Check if there's an existing action for the user on this content
        existing_action = UserContentAction.query.filter_by(
            user_id=user_id,
            content_id=content_id
        ).first()

        if existing_action:
            if existing_action.action == 'like':
                return jsonify({"message": "Already liked"}), 200
            elif existing_action.action == 'dislike':
                # Update the action to like
                existing_action.action = 'like'
            else:
                # Existing action is neither like nor dislike
                existing_action.action = 'like'
        else:
            # Create a new like action
            new_action = UserContentAction(
                user_id=user_id,
                content_id=content_id,
                action='like'
            )
            db.session.add(new_action)

        db.session.commit()
        return jsonify({"success": "Content liked successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
