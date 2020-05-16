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
    
    #To String method
    def __repr__(self):
        return '<User {}>'.format(self.username)  


class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True) #we can use the id number for number of days in a routine, with a hardcap on 7 
    title = db.Column(db.String(80), nullable=False, unique= True)
    split = db.Column(db.String(80), nullable = False)
    duration_minutes = db.Column(db.Integer , nullable = False)
    duration_seconds = db.Column(db.Integer , nullable = False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable = False)
    description = db.Column(db.String(240), nullable = True)
    #video = db.Column(
    #audio = db.Column(
    #photo = db.Column(
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable = False)
    

    def toDict(self):
        return {
            "id": self.id,
            "title": self.title,
            "split": self.split,
            "duration_minutes": self.duration_minutes,
            "duration_seconds": self.duration_seconds,
            "description": self.description,
            #"video": self.video,
            #"audio": self.audio,
            #"photo": self.photo,
            "date": self.date
        }
