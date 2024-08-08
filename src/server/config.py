import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://moringa_user:Brian_6534@localhost/moringa_platform_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'super-secret'
    # JWT_ACCESS_TOKEN_EXPIRES = 36500
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)  # Set the token expiration time
