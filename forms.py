from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, DateTimeField, IntegerField
from wtforms.validators import InputRequired, EqualTo, Email

class SignUpForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    email = StringField('Email', validators=[Email(), InputRequired()])
    password = PasswordField('New Password', validators=[InputRequired(), EqualTo('confirm', message='Passwords must match')])
    confirm  = PasswordField('Repeat Password')
    submit = SubmitField('Sign Up')

class LogInForm(FlaskForm):
    username = StringField('username', validators=[InputRequired()])
    password = PasswordField('New Password', validators=[InputRequired()])
    submit = SubmitField('Login')
    
class WorkoutForm(FlaskForm):
    title = StringField('title', validators=[InputRequired()])
    duration = IntegerField('Length of Workout Session', validators=[InputRequired()])
    date = DateTimeField('Date', validators=[InputRequired(), DateRange(
            min=datetime(2020, 1, 1),
            max=datetime(9999, 12, 12))]
    submit = SubmitField('Add Workout')
    
