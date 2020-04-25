from flask import Flask, request, render_template

app = Flask(__name__)

if __name__ == "__main__":
    app.run(debug=True)

@app.route('/')
def index():
    return render_template("home.html")

@app.route('/my-workouts')
def getWorkouts():
    return render_template("my-workouts.html")
