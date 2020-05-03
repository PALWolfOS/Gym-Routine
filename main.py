from flask import Flask, request, render_template, flash, redirect, url_for
from models import Workout, User, db
from forms import SignUpForm, LogInForm
from flask_login import login_user, logout_user, LoginManager


def create_app():
    app = Flask(__name__, static_url_path='')
    app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///test.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    app.config['SECRET_KEY'] = "MYSECRET"
    db.init_app(app)
    return app


app = create_app()
login_manager = LoginManager(app)
login_manager.init_app(app)

if __name__ == "__main__":
    app.run(debug=True)

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route('/signup', methods=['GET', 'POST'])
def signUp():
    form = SignUpForm()
    if form.validate_on_submit():
        data = request.form
        newUser = User(username=data['username'], email=data['email'])
        newUser.set_password(data['password'])
        db.session.add(newUser)
        db.session.commit()
        flash('Account Created')
        return redirect(url_for('index'))
    return render_template("registration/signup.html", form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LogInForm()
    if form.validate_on_submit():
        data = request.form
        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            flash('Logged in successfully.')
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password')
            return redirect(url_for('login'))
    return render_template("registration/login.html", form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/')
def index():
    Workouts = Workout.query.all()
    return render_template("gym-routine-app/home.html", workouts=Workouts)


@app.route('/my-workouts')
def getWorkouts():
    return render_template("my-workouts.html")
