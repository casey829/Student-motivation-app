from flask import Flask, request, jsonify,send_file
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from io import BytesIO
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
        
        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400
        
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
    
class UploadContent(Resource):
    @jwt_required()  # Ensure the user is authenticated
    def post(self, content_type):
        user = get_jwt_identity()  # Retrieve authenticated user's ID
        
        # Validate content type
        if content_type not in ['video', 'audio', 'article']:
            return jsonify({"error": "Invalid content type"}), 400

        try:
            if content_type == 'video':
                file = request.files.get('file')
                title = request.form.get('title')
                
                if not file or not title:
                    return jsonify({"error": "File and title are required"}), 400
                
                # Validate file size (e.g., max 100 MB)
                file.seek(0)  # Reset file pointer before size check
                if len(file.read()) > 100 * 1024 * 1024:  # 100 MB
                    return jsonify({"error": "File size exceeds the 100 MB limit"}), 400

                file.seek(0)  # Reset file pointer after size check
                filename = secure_filename(file.filename)
                file_data = file.read()

                new_content = Video(
                    title=title,
                    file_data=file_data,
                    user_id=user,
                )
                db.session.add(new_content)
                db.session.commit()
                return jsonify({"success": "Video uploaded successfully"}), 201

            elif content_type == 'audio':
                file = request.files.get('file')
                title = request.form.get('title')

                if not file or not title:
                    return jsonify({"error": "File and title are required"}), 400

                # Validate file size (e.g., max 50 MB)
                file.seek(0)  # Reset file pointer before size check
                if len(file.read()) > 50 * 1024 * 1024:  # 50 MB
                    return jsonify({"error": "File size exceeds the 50 MB limit"}), 400

                file.seek(0)  # Reset file pointer after size check
                filename = secure_filename(file.filename)
                file_data = file.read()

                new_content = Audio(
                    title=title,
                    file_data=file_data,
                    user_id=user,
                )
                db.session.add(new_content)
                db.session.commit()
                return jsonify({"success": "Audio uploaded successfully"}), 201

            elif content_type == 'article':
                content_text = request.form.get('content')
                title = request.form.get('title')

                if not content_text or not title:
                    return jsonify({"error": "Title and content are required"}), 400

                if len(content_text) > 5000:
                    return jsonify({"error": "Content exceeds the 5000 character limit"}), 400

                new_content = Article(
                    title=title,
                    content_text=content_text,
                    user_id=user,
                )
                db.session.add(new_content)
                db.session.commit()
                return jsonify({"success": "Article uploaded successfully"}), 201

        except Exception as e:
            db.session.rollback()  # Rollback the session in case of an error
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500
        
class GetContent(Resource):
    @jwt_required()  # Ensure the user is authenticated
    def get(self, content_type, content_id):
        try:
            if content_type == 'video':
                content = Video.query.get_or_404(content_id)
                return send_file(
                    BytesIO(content.file_data),
                    mimetype='video/mp4',  # Assuming the video is in mp4 format
                    as_attachment=True,
                    download_name=f"{content.title}.mp4"
                )

            elif content_type == 'audio':
                content = Audio.query.get_or_404(content_id)
                return send_file(
                    BytesIO(content.file_data),
                    mimetype='audio/mpeg',  # Assuming the audio is in mp3 format
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
        
class CommentResource(Resource):
    @jwt_required()
    def post(self, content_type, content_id, parent_comment_id=None):
        """Post a new comment or a reply."""
        user_id = get_jwt_identity()  # Retrieve authenticated user's ID

        # Extract data from the request
        text = request.json.get('text')

        # Validate content type
        if content_type not in ['video', 'audio', 'article']:
            return jsonify({"error": "Invalid content type"}), 400

        # Validate input data
        if not content_id or not text:
            return jsonify({"error": "Content ID and text are required"}), 400

        # Validate parent comment if present
        if parent_comment_id:
            parent_comment = Comment.query.get(parent_comment_id)
            if not parent_comment:
                return jsonify({"error": "Parent comment not found"}), 404

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
                parent_id=parent_comment_id
            )
            db.session.add(new_comment)
            db.session.commit()
            return jsonify({"success": "Comment posted successfully"}), 201

        except Exception as e:
            db.session.rollback()  # Rollback the session in case of an error
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    def get(self, content_type, content_id):
        """Retrieve comments and replies for a specific content."""
        if content_type not in ['video', 'audio', 'article']:
            return jsonify({"error": "Invalid content type"}), 400

        content_classes = {'video': Video, 'audio': Audio, 'article': Article}
        content_class = content_classes.get(content_type)

        content = content_class.query.get(content_id)
        if not content:
            return jsonify({"error": "Content not found"}), 404

        comments = Comment.query.filter_by(content_id=content_id, content_type=content_type, parent_id=None).all()

        def format_comment(comment):
            return {
                "id": comment.id,
                "content_id": comment.content_id,
                "content_type": comment.content_type,
                "text": comment.text,
                "user_id": comment.user_id,
                "created_at": comment.created_at,
                "replies": [format_comment(reply) for reply in Comment.query.filter_by(parent_id=comment.id).all()]
            }

        return jsonify([format_comment(comment) for comment in comments]), 200

    @jwt_required()
    def delete(self, comment_id):
        """Delete a comment or a reply."""
        user_id = get_jwt_identity()  # Retrieve authenticated user's ID

        # Find the comment to delete
        comment = Comment.query.get_or_404(comment_id)

        # Ensure the user is allowed to delete the comment
        if comment.user_id != user_id:
            return jsonify({"error": "You can only delete your own comments"}), 403

        try:
            # Delete all replies of the comment
            Comment.query.filter_by(parent_id=comment_id).delete()
            db.session.delete(comment)
            db.session.commit()
            return jsonify({"success": "Comment deleted successfully"}), 200

        except Exception as e:
            db.session.rollback()  # Rollback the session in case of an error
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Adding the resources to the API
api.add_resource(HomePage, '/homepage', endpoint='homepage')          # GET /homepage
api.add_resource(UserSignUp, '/users', endpoint='users')            # POST /users
api.add_resource(UserLogin, '/login', endpoint='login')             # POST /login
api.add_resource(About, '/about', endpoint='about')                 # GET /about
api.add_resource(AdminDashboard, '/admin/dashboard', endpoint='admin_dashboard')  # GET /admin/dashboard
api.add_resource(StaffDashboard, '/staff/dashboard', endpoint='staff_dashboard')  # GET /staff/dashboard
api.add_resource(StudentDashboard, '/student/dashboard', endpoint='student_dashboard')  # GET /student/dashboard
api.add_resource(UserProfile, '/profile', endpoint='profile')  # GET /profile
api.add_resource(Logout, '/logout', endpoint='logout')  # GET /logout
api.add_resource(CreateCategory, '/create/category', endpoint='create_category')  # POST /create/category
api.add_resource(SubscribeCategory, '/subscribe/category', endpoint='subscribe_category')  # POST /subscribe/category
api.add_resource(UploadContent, '/upload/<string:content_type>', endpoint='upload_content')  # POST /upload/video
api.add_resource(GetContent, '/content/<string:content_type>/<int:content_id>', endpoint='content')  # GET /content/video/1
api.add_resource(CommentResource,'/<content_type>/<content_id>/comments',endpoint='content_comments')  # POST /content/video/1/comment
api.add_resource(CommentResource,'/comments/<int:comment_id>/replies',endpoint='comment_replies')  # POST /content/video/1/comment/1/reply


if __name__ == '__main__':
    app.run(debug=True)
