from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS

from models import db, Habit, Session, Category, Goal

app = Flask(__name__)
CORS(app)

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///habitclock.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def home():
    return {"message": "HabitClock backend running"}

if __name__ == '__main__':
    app.run(debug=True)
