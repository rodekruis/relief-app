from flask_login import UserMixin
from flask import current_app
db = current_app.config['SQLALCHEMY_DATABASE']


class User(UserMixin, db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)  # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))


class Distribution(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)  # primary keys are required by SQLAlchemy
    user_email = db.Column(db.String(100))
    name = db.Column(db.String(100))
