from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS

from models import db, Habit, Session, Category, Goal

# import your blueprints
from routes.auth import auth_bp
from routes.habit_routes import habit_bp
from routes.session_routes import session_bp
from routes.category_routes import category_bp
from routes.goal_routes import goal_bp

app = Flask(__name__)
CORS(app, supports_credentials=True)

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///habitclock.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "something-secure"

app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

# register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(habit_bp)
app.register_blueprint(session_bp)
app.register_blueprint(category_bp)
app.register_blueprint(goal_bp)

@app.route('/')
def home():
    return {"message": "HabitClock backend running"}

if __name__ == '__main__':
    app.run(debug=True)
