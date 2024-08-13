from app import app, db
from models import User, Role, Category, Video, Audio, Article
from flask_bcrypt import Bcrypt
import base64

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt(app)

def create_roles():
    try:
        # Create roles
        admin_role = Role(name='Admin')
        staff_role = Role(name='Staff')
        student_role = Role(name='Student')

        db.session.add(admin_role)
        db.session.add(staff_role)
        db.session.add(student_role)
        db.session.commit()
        print("Roles created successfully.")
    except Exception as e:
        db.session.rollback()
        print(f"Error creating roles: {e}")

def create_users():
    try:
        # Create roles
        admin_role = Role.query.filter_by(name='Admin').first()
        staff_role = Role.query.filter_by(name='Staff').first()
        student_role = Role.query.filter_by(name='Student').first()

        if not all([admin_role, staff_role, student_role]):
            print("One or more roles are missing. Ensure roles are created before creating users.")
            return

        # Create users
        admin_user = User(
            username='admin',
            email='admin@example.com',
            password_hash=bcrypt.generate_password_hash('adminpass').decode('utf-8'),
            role='admin'
        )
        staff_user = User(
            username='staff',
            email='staff@example.com',
            password_hash=bcrypt.generate_password_hash('staffpass').decode('utf-8'),
            role='staff'
        )
        student_user = User(
            username='student',
            email='student@example.com',
            password_hash=bcrypt.generate_password_hash('studentpass').decode('utf-8'),
            role='student'
        )

        db.session.add(admin_user)
        db.session.add(staff_user)
        db.session.add(student_user)
        db.session.commit()

        # Assign roles to users
        admin_user.roles.append(admin_role)
        staff_user.roles.append(staff_role)
        student_user.roles.append(student_role)

        db.session.commit()
        print("Users created and roles assigned successfully.")
    except Exception as e:
        db.session.rollback()
        print(f"Error creating users: {e}")

def create_categories():
    try:
        # Create categories
        tech_category = Category(name='Technology', description='All about technology')
        science_category = Category(name='Science', description='Scientific content and news')

        db.session.add(tech_category)
        db.session.add(science_category)
        db.session.commit()
        print("Categories created successfully.")
    except Exception as e:
        db.session.rollback()
        print(f"Error creating categories: {e}")

def create_content():
    try:
        # Create some example content
        user = User.query.filter_by(username='student').first()

        if not user:
            print("No user found. Ensure at least one user exists before creating content.")
            return

        # Video example
        video_data = base64.b64encode(b'Fake video data').decode('utf-8')  # Fake video data
        video = Video(
            filename='example_video.mp4',
            file_data=base64.b64decode(video_data),
            description='An example video',
            user_id=user.id
        )

        # Audio example
        audio_data = base64.b64encode(b'Fake audio data').decode('utf-8')  # Fake audio data
        audio = Audio(
            filename='example_audio.mp3',
            file_data=base64.b64decode(audio_data),
            description='An example audio',
            user_id=user.id
        )

        # Article example
        article = Article(
            title='Example Article',
            content='This is an example article.',
            user_id=user.id
        )

        db.session.add(video)
        db.session.add(audio)
        db.session.add(article)
        db.session.commit()
        print("Content created successfully.")
    except Exception as e:
        db.session.rollback()
        print(f"Error creating content: {e}")

def seed():
    with app.app_context():
        print("Starting database seeding...")
        create_roles()
        create_users()
        create_categories()
        create_content()
        print("Database seeding completed.")

if __name__ == '__main__':
    seed()
