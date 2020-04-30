from flask import Flask, request, render_template, flash, redirect, url_for
from models import Workout, User, db
from forms import SignUp


def create_app():
    app = Flask(__name__, static_url_path='')
    app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///test.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    app.config['SECRET_KEY'] = "MYSECRET"
    db.init_app(app)
    return app


app = create_app()

app.app_context().push()


if __name__ == "__main__":
    app.run(debug=True)


@app.route('/signup', methods=['GET', 'POST'])
def signUp():
    form = SignUp()
    if form.validate_on_submit():
        data = request.form
        newUser = User(username=data['username'], email=data['email'])
        newUser.set_password(data['password'])
        db.session.add(newUser)
        db.session.commit()
        flash('Account Created')
        return redirect(url_for('index'))
        return render_template('signup.html', form=form)


@app.route('/')
def index():
    Workouts = Workout.query.all()
    return render_template("home.html", workouts = Workouts)


@app.route('/my-workouts')
def getWorkouts():
    return render_template("my-workouts.html")
