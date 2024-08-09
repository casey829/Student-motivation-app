#server/config.py
import os
class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:database@localhost:5432/techstudy"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'secretkey'
    