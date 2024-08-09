from sqlalchemy_serializer import SerializerMixin
from flask_security import UserMixin, RoleMixin
from sqlalchemy import DateTime, func
from server.extensions import db

# UserRoles Model
user_roles = db.Table('user_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True))

# User Model
class User(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(DateTime, server_default=func.current_timestamp())
    updated_at = db.Column(DateTime, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relationships
    roles = db.relationship('Role', secondary=user_roles, back_populates='users')
    videos = db.relationship('Video', back_populates='user', lazy=True, cascade='all, delete-orphan')
    audios = db.relationship('Audio', back_populates='user', lazy=True, cascade='all, delete-orphan')
    articles = db.relationship('Article', back_populates='user', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='user', lazy=True, cascade='all, delete-orphan')
    
    # Serialize rules
    serialize_rules = ('-roles.users',)

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
