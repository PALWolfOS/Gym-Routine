from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash,check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(120), nullable=False)
    workouts = db.relationship("Workout", backref="user", lazy=True)

    def toDict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "password": self.password
        }

    def set_password(self, password):
        self.password = generate_password_hash(password, method="sha256")

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False, unique= True)
    split = db.Column(db.String(80), nullable = False)
    duration = db.Column(db.Integer , nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable = False)

    def toDict(self):
        return {
            "id": self.id,
            "title": self.title,
            "split": self.split,
            "duration": self.duration
        }