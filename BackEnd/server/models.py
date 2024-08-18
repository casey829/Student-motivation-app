from sqlalchemy_serializer import SerializerMixin
from flask_security import UserMixin, RoleMixin
from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import ARRAY


from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
# UserRoles Model
user_roles = db.Table('user_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True))
user_categories = db.Table('user_categories',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True))

# User Model
class User(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(255), nullable=True)
    is_verified = db.Column(db.Boolean, default=True)
    verification_token = db.Column(db.String(255),unique=True, nullable=True)
    token_expiry = db.Column(db.DateTime, nullable=True)
    preferences = db.Column(ARRAY(db.String),nullable=True)
    created_at = db.Column(DateTime, server_default=func.current_timestamp())
    updated_at = db.Column(DateTime, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    def to_dict(self):
        return {
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at
        }
    
    # Relationships
    roles = db.relationship('Role', secondary=user_roles, back_populates='users')
    videos = db.relationship('Video', back_populates='user', lazy=True, cascade='all, delete-orphan')
    audios = db.relationship('Audio', back_populates='user', lazy=True, cascade='all, delete-orphan')
    articles = db.relationship('Article', back_populates='user', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='user', lazy=True, cascade='all, delete-orphan')
    categories = db.relationship('Category', secondary=user_categories, back_populates='subscribers')
    content_actions = db.relationship('UserContentAction', back_populates='user', lazy=True, cascade='all, delete-orphan')
    
    # Serialize rules
    serialize_rules = ('-roles.users','-videos.user', '-audios.user', '-articles.user', '-comments.user', '-categories.subscribers', '-content_actions.user')

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email}, role_ids={[r.id for r in self.roles]})>"


    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email}, role_ids={[r.id for r in self.roles]})>"

# Role Model
class Role(db.Model, RoleMixin, SerializerMixin):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    
    users = db.relationship('User', secondary=user_roles, back_populates='roles')
    
    serialize_rules = ('-users.roles',)

    def __repr__(self):
        return f"<Role(id={self.id}, name={self.name})>"

# Video Model
class Video(db.Model, SerializerMixin):
    __tablename__ = 'videos'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_data = db.Column(db.LargeBinary, nullable=False)
    description = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    uploaded_at = db.Column(DateTime, server_default=func.current_timestamp())
    approved = db.Column(db.Boolean, default=False)
    category = db.Column(db.String(255), nullable=True)
    
    # Relationships
    user = db.relationship('User', back_populates='videos')
    comments = db.relationship('Comment', back_populates='video', lazy=True, cascade='all, delete-orphan')

    # Serialize rules
    serialize_rules = ('-comments.video', '-user.videos')

    def __repr__(self):
        return f"<Video(id={self.id}, filename={self.filename}, user_id={self.user_id})>"

# Audio Model
class Audio(db.Model, SerializerMixin):
    __tablename__ = 'audios'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_data = db.Column(db.LargeBinary, nullable=False)
    description = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    uploaded_at = db.Column(DateTime, server_default=func.current_timestamp())
    approved = db.Column(db.Boolean, default=False)
    category = db.Column(db.String(255), nullable=True)
    
    # Relationships
    user = db.relationship('User', back_populates='audios')
    comments = db.relationship('Comment', back_populates='audio', lazy=True, cascade='all, delete-orphan')

    # Serialize rules
    serialize_rules = ('-comments.audio', '-user.audios')

    def __repr__(self):
        return f"<Audio(id={self.id}, filename={self.filename}, user_id={self.user_id})>"

# Article Model
class Article(db.Model, SerializerMixin):
    __tablename__ = 'articles'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    uploaded_at = db.Column(DateTime, server_default=func.current_timestamp())
    approved = db.Column(db.Boolean, default=False)
    category = db.Column(db.String(255), nullable=True)
    
    # Relationships
    user = db.relationship('User', back_populates='articles')
    comments = db.relationship('Comment', back_populates='article', lazy=True, cascade='all, delete-orphan')

    # Serialize rules
    serialize_rules = ('-comments.article', '-user.articles')

    def __repr__(self):
        return f"<Article(id={self.id}, title={self.title}, user_id={self.user_id})>"

# Comment Model
class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    video_id = db.Column(db.Integer, db.ForeignKey('videos.id', ondelete='CASCADE'), nullable=True)
    audio_id = db.Column(db.Integer, db.ForeignKey('audios.id', ondelete='CASCADE'), nullable=True)
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id', ondelete='CASCADE'), nullable=True)
    created_at = db.Column(DateTime, server_default=func.current_timestamp())
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id', ondelete='CASCADE'), nullable=True)
    
    # Relationships
    user = db.relationship('User', back_populates='comments')
    video = db.relationship('Video', back_populates='comments', single_parent=True)
    audio = db.relationship('Audio', back_populates='comments', single_parent=True)
    article = db.relationship('Article', back_populates='comments', single_parent=True)
    parent = db.relationship('Comment', remote_side=[id], back_populates='replies')
    replies = db.relationship('Comment', back_populates='parent', lazy=True, cascade='all, delete-orphan')

    # Serialize rules
    serialize_rules = ('-user.comments', '-video.comments', '-audio.comments', '-article.comments', '-replies', '-parent')

    def __repr__(self):
        return f"<Comment(id={self.id}, content={self.content}, user_id={self.user_id})>"

# Categories Model
class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(DateTime, server_default=func.current_timestamp())

    # Relationships
    subscribers = db.relationship('User', secondary=user_categories, back_populates='categories')

    def __repr__(self):
        return f"<Category(id={self.id}, name={self.name})>"

    # Serialize rules
    serialize_rules = ('-id',)


    def __repr__(self):
        return f"<Category(id={self.id}, name={self.name})>"
    

class BlacklistedToken(db.Model):
    __tablename__ = 'blacklisted_tokens'
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    added_at = db.Column(db.DateTime, server_default=func.current_timestamp())
    
    def __repr__(self):
        return f"<BlacklistedToken(token={self.token})>"
class UserContentAction(db.Model):
    __tablename__ = 'user_content_actions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content_id = db.Column(db.Integer, nullable=False)
    content_type = db.Column(db.String(50), nullable=False)  # 'video', 'audio', 'article'
    action = db.Column(db.String(10), nullable=False)  # 'like', 'dislike', 'no_engagement'

    user = db.relationship('User', back_populates='content_actions')
    
   
    def __repr__(self):
        return f"<UserContentAction(user_id={self.user_id}, content_id={self.content_id}, content_type={self.content_type}, action={self.action})>"