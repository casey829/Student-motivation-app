from flask import Flask, request, jsonify,send_file,url_for
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from io import BytesIO
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_restful import Api
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from werkzeug.security import generate_password_hash
from models import db, User, Category, Article, Video, Audio, Comment, BlacklistedToken, UserContentAction
import traceback
import base64
import uuid
from datetime import datetime, timedelta
app = Flask(__name__)
CORS(app)


app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://user_database_v2g0_user:9eG3I1HHRXhLC0NiIMW1ZybtGD5Hzavo@dpg-cqkfepbqf0us73c9c5ug-a.oregon-postgres.render.com/user_database_v2g0"
app.config["JWT_SECRET_KEY"] = "fsbdgfnhgvjnvhmvh"
app.config["SECRET_KEY"] = "JKSRVHJVFBSRDFV"


bcrypt = Bcrypt(app)
jwt = JWTManager(app)
api = Api(app)

migrate = Migrate(app, db)
db.init_app(app)
#NWJ717STU5RTM5SHGTFNBAKV

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587 # May be another value based on the server
app.config['MAIL_USE_TLS'] = True # Test first to see whether true or false works
app.config['MAIL_USE_SSL'] = False # Test first to see whether true or false works
app.config['MAIL_DEBUG'] = True # same value as the debug
app.config['MAIL_USERNAME'] = 'alistairsmunene@gmail.com'
app.config['MAIL_PASSWORD'] = 'cnjg loxy ymfv tpjv' # will move this to a .env file for safety
app.config['MAIL_DEFAULT_SENDER'] = 'alistairsmunene@gmail.com'

# Initialising Flask-Mail
mail = Mail(app)
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])


# user_id = get_jwt_identity()
# Homepage Routes

# Home Page
@app.route('/homepage', methods=['GET']) #works fine
def home_page():
    return jsonify({"message": "Welcome to TechStudy"}), 200

# User Sign Up
@app.route('/sign-up', methods=['POST'])
def user_sign_up():
    data = request.get_json()

    user_type = data.get('userType')  # Adjusted to match client-side
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Basic validation
    if not all([user_type, username, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    if user_type not in ['student', 'staff']:
        return jsonify({'error': 'Invalid user type'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    token = s.dumps(email, salt='email-confirm')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        role=user_type,
        is_verified=False,  
        verification_token= token ,# Store token
        
    )
    
    db.session.add(new_user)
    db.session.commit()

    msg = Message('Welcome to TechStudy', recipients=[email])
    link = url_for('confirm_email', token=token, _external=True)
    msg.body = f'Please click the link below to confirm your email: {link}'

    try:
        mail.send(msg)
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Email could not be sent.'}), 500

    return jsonify({
        'success': f'{user_type.capitalize()} has been created successfully. Please check your email to confirm your account.'
    }), 201

# Confirm Email
@app.route('/confirm-email/<token>', methods=['GET'])
def confirm_email(token):
    try:
        # Verify the token
        email = s.loads(token, salt='email-confirm', max_age=3600)
        user = User.query.filter_by(email=email).first()

        if user:
            if user.verification_token == token:
                # Mark the user as verified
                user.is_verified = True
                user.verification_token = token  # Reset the verification token
                user.token_expiry = datetime.utcnow() + timedelta(hours=1)
                db.session.commit()
                print('Email confirmed! You can now log in.')
                return jsonify({'message': 'Email confirmed! You can now log in.'}), 200
            else:
                return jsonify({'error': 'Invalid or expired token.'}), 400
        else:
            return jsonify({'error': 'User not found.'}), 404
    except SignatureExpired:
        return jsonify({'error': 'The token has expired.'}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

# User Login
@app.route('/login', methods=['POST']) #works fine
def user_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    
    user = User.query.filter_by(email=email).first()

    #Debugging output
    print("Stored Password: ", user.password_hash)

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


# Upload Content Video
@app.route('/upload/video', methods=['POST'])
@jwt_required()
def upload_video():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"message": "Unauthorized"}), 401

    try:
        data = request.get_json()
        file_data_base64 = data.get('file')
        title = data.get('title')

        if not file_data_base64 or not title:
            return jsonify({"error": "File data and title are required"}), 400

        # Decode the base64 file data
        file_data = base64.b64decode(file_data_base64)
        filename = f"{uuid.uuid4().hex}_video"

        max_size = 100 * 1024 * 1024  # 100 MB
        if len(file_data) > max_size:
            return jsonify({"error": "File size exceeds the 100 MB limit"}), 400

        new_content = Video(
            filename=filename,
            file_data=file_data,
            description=title,
            user_id=user_id,
        )

        db.session.add(new_content)
        db.session.commit()
        return jsonify({"success": "Video uploaded successfully"}), 201

    except Exception as e:
        db.session.rollback()
        traceback_str = traceback.format_exc()
        print(f"An error occurred: {traceback_str}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    
# Upload Content Audio
@app.route('/upload/audio', methods=['POST'])
@jwt_required()
def upload_audio():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"message": "Unauthorized"}), 401

    try:
        data = request.get_json()
        file_data_base64 = data.get('file')
        title = data.get('title')

        if not file_data_base64 or not title:
            return jsonify({"error": "File data and title are required"}), 400

        # Decode the base64 file data
        file_data = base64.b64decode(file_data_base64)
        filename = f"{uuid.uuid4().hex}_audio"

        max_size = 50 * 1024 * 1024  # 50 MB
        if len(file_data) > max_size:
            return jsonify({"error": "File size exceeds the 50 MB limit"}), 400

        new_content = Audio(
            filename=filename,
            file_data=file_data,
            description=title,
            user_id=user_id,
        )

        db.session.add(new_content)
        db.session.commit()
        return jsonify({"success": "Audio uploaded successfully"}), 201

    except Exception as e:
        db.session.rollback()
        traceback_str = traceback.format_exc()
        print(f"An error occurred: {traceback_str}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    
# Upload Content Article
@app.route('/upload/article', methods=['POST'])
@jwt_required()
def upload_article():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"message": "Unauthorized"}), 401

    try:
        data = request.get_json()
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
        traceback_str = traceback.format_exc()
        print(f"An error occurred: {traceback_str}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Get Content Video
@app.route('/content/video/<int:content_id>', methods=['GET'])
@jwt_required()
def get_video(content_id):
    try:
        content = Video.query.get_or_404(content_id)
        return send_file(
            BytesIO(content.file_data),
            mimetype='video/mp4',
            as_attachment=True,
            download_name=f"{content.title}.mp4"
        )
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Get Content Audio
@app.route('/content/audio/<int:content_id>', methods=['GET'])
@jwt_required()
def get_audio(content_id):
    try:
        content = Audio.query.get_or_404(content_id)
        return send_file(
            BytesIO(content.file_data),
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name=f"{content.title}.mp3"
        )
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
from flask import jsonify
from flask_jwt_extended import jwt_required
from models import Article


# Get Article
@app.route('/content/article/<int:content_id>', methods=['GET'])
@jwt_required()
def get_article(content_id):
    try:
        content = Article.query.get_or_404(content_id)
        return jsonify({
            "title": content.title,
            "content": content.content,
            "author_id": content.user_id,
            "created_at": content.created_at
        }), 200
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
    

# Get Comments
@app.route('/<string:content_type>/<int:content_id>/comments', methods=['GET'])
@jwt_required()
def get_comments(content_type, content_id):
    if content_type not in ['video', 'audio', 'article']:
        return jsonify({"error": "Invalid content type"}), 400

    try:
        # Fetch comments based on content type and content ID
        comments = Comment.query.filter_by(content_id=content_id, content_type=content_type).all()

        if not comments:
            return jsonify({"message": "No comments found"}), 404

        # Format comments for the response
        comments_list = [
            {
                "id": comment.id,
                "text": comment.text,
                "user_id": comment.user_id,
                "created_at": comment.created_at,
                "parent_id": comment.parent_id
            }
            for comment in comments
        ]

        return jsonify({"comments": comments_list}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Like/Dislike Content
#Helper functions
def get_content_by_type(content_type, content_id):
    if content_type == 'video':
        return Video.query.get(content_id)
    elif content_type == 'audio':
        return Audio.query.get(content_id)
    elif content_type == 'article':
        return Article.query.get(content_id)
    return None
# Like Content
@app.route('/<string:content_type>/<int:content_id>/like', methods=['POST'])
@jwt_required()
def like_content(content_type, content_id):
    user_id = get_jwt_identity()

    if content_type not in ['video', 'audio', 'article']:
        return jsonify({"error": "Invalid content type"}), 400

    try:
        # Retrieve the content based on the content type
        content = get_content_by_type(content_type, content_id)
        if not content:
            return jsonify({"error": "Content not found"}), 404

        # Check for existing user action
        existing_action = UserContentAction.query.filter_by(
            user_id=user_id,
            content_id=content_id
        ).first()

        if existing_action:
            if existing_action.action == 'like':
                return jsonify({"message": "Already liked"}), 200
            elif existing_action.action == 'dislike':
                existing_action.action = 'like'
        else:
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


# Dislike Content
@app.route('/<string:content_type>/<int:content_id>/dislike', methods=['POST'])
@jwt_required()
def dislike_content(content_type, content_id):
    user_id = get_jwt_identity()

    if content_type not in ['video', 'audio', 'article']:
        return jsonify({"error": "Invalid content type"}), 400

    try:
        # Retrieve the content based on the content type
        content = get_content_by_type(content_type, content_id)
        if not content:
            return jsonify({"error": "Content not found"}), 404

        # Check for existing user action
        existing_action = UserContentAction.query.filter_by(
            user_id=user_id,
            content_id=content_id
        ).first()

        if existing_action:
            if existing_action.action == 'dislike':
                return jsonify({"message": "Already disliked"}), 200
            elif existing_action.action == 'like':
                existing_action.action = 'dislike'
        else:
            new_action = UserContentAction(
                user_id=user_id,
                content_id=content_id,
                action='dislike'
            )
            db.session.add(new_action)

        db.session.commit()
        return jsonify({"success": "Content disliked successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Approve Content
@app.route('/admin/approve-content/<int:content_id>/<string:content_type>', methods=['POST'])
@jwt_required()
def approve_content(content_id, content_type):
    # Get current user from JWT
    current_user = get_jwt_identity()
    user = User.query.get_or_404(current_user['id'])

    # Check if the current user is an admin
    if user.role != 'admin':
        return jsonify({"message": "Permission denied!"}), 403

    # Find the content by type and ID
    content = None
    if content_type == 'video':
        content = Video.query.get_or_404(content_id)
    elif content_type == 'audio':
        content = Audio.query.get_or_404(content_id)
    elif content_type == 'article':
        content = Article.query.get_or_404(content_id)
    else:
        return jsonify({"message": "Invalid content type!"}), 400

    # Check if content is already approved
    if content.is_approved:
        return jsonify({"message": "Content is already approved!"}), 400

    # Mark the content as approved
    content.is_approved = True
    db.session.commit()

    return jsonify({"message": "Content approved successfully!"}), 200
# Flag Content
@app.route('/<string:content_type>/<int:content_id>/flag', methods=['POST'])
@jwt_required()
def flag_content(content_type, content_id):
    user_id = get_jwt_identity()

    if content_type not in ['video', 'audio', 'article']:
        return jsonify({"error": "Invalid content type"}), 400

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
        content_type=content_type,
        content_id=content_id
    ).first()

    if existing_action:
        return jsonify({"error": "Content already flagged by this user"}), 400

    # Record the flagging action
    new_action = UserContentAction(
        user_id=user_id,
        content_type=content_type,
        content_id=content_id,
        action_type='flagged'  # You can also have 'reported' or other types of actions
    )
    db.session.add(new_action)
    db.session.commit()

    return jsonify({"success": "Content flagged successfully"}), 200


# Remove Content
@app.route('/<string:content_type>/<int:content_id>/remove', methods=['POST'])
@jwt_required()
def remove_content(content_type, content_id):
    user_id = get_jwt_identity()

    # Check if the user is an admin
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({"error": "Admin access required"}), 403

    if content_type not in ['video', 'audio', 'article']:
        return jsonify({"error": "Invalid content type"}), 400

    # Retrieve the content based on the content type
    if content_type == 'video':
        content = Video.query.get(content_id)
    elif content_type == 'audio':
        content = Audio.query.get(content_id)
    elif content_type == 'article':
        content = Article.query.get(content_id)

    if not content:
        return jsonify({"error": "Content not found"}), 404

    # Remove the content
    db.session.delete(content)
    db.session.commit()

    return jsonify({"success": "Content removed successfully"}), 200


# Get Content
@app.route('/contents/filter', methods=['GET'],endpoint='user_get_content')
@jwt_required()
def get_content():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Retrieve user preferences
    preferences = user.preferences or []

    # Initialize content lists
    videos = []
    audios = []
    articles = []

    # Pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    try:
        # Query content based on preferences
        if 'video' in preferences:
            videos = Video.query.paginate(page, per_page, False).items

        if 'audio' in preferences:
            audios = Audio.query.paginate(page, per_page, False).items

        if 'article' in preferences:
            articles = Article.query.paginate(page, per_page, False).items

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Combine and return the filtered content
    content = {
        'videos': [video.to_dict() for video in videos],
        'audios': [audio.to_dict() for audio in audios],
        'articles': [article.to_dict() for article in articles]
    }

    return jsonify(content), 200
@app.route('/content', methods=['GET'])
@jwt_required()
def get_content():
    content_type = request.args.get('type')  # 'video', 'audio', or 'article'
    title = request.args.get('title')  # Filter by title
    category = request.args.get('category')  # Filter by category

    # Validate content type
    if content_type not in ['video', 'audio', 'article']:
        return jsonify({"message": "Invalid content type!"}), 400

    # Map content type to model
    model = {
        'video': Video,
        'audio': Audio,
        'article': Article
    }.get(content_type)

    # Start building the query
    query = model.query

    # Filter by title if provided
    if title:
        query = query.filter(model.title.ilike(f"%{title}%"))
    
    # Filter by category if provided
    if category:
        # Adjust based on your schema
        query = query.join(model.category).filter(Category.name.ilike(f"%{category}%"))

    try:
        results = query.all()

        content_list = [
            {
                'id': item.id,
                'title': item.title,
                'description': item.description,
                'is_approved': item.is_approved,
                'category': item.category.name if item.category else None
            }
            for item in results
        ]

        return jsonify(content_list), 200
    
    except Exception as e:
        return jsonify({"message": f"Database error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port = 5000,debug=True)
