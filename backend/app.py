from flask import Flask
import os
from flask_migrate import Migrate
from flask_cors import CORS

from models import db
from routes.auth import auth_bp
from routes.habit_routes import habit_bp
from routes.session_routes import session_bp
from routes.category_routes import category_bp
from routes.goal_routes import goal_bp

app = Flask(__name__)
app.url_map.strict_slashes = False

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///habitclock.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "something-secure")
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True

app.config.from_object(Config)

CORS(
    app,
    supports_credentials=True,
    origins=[
        "https://habit-clock-xi.vercel.app",
        "http://localhost:5173"
    ]
)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "https://habit-clock-xi.vercel.app"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"
    return response

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(auth_bp)
app.register_blueprint(habit_bp)
app.register_blueprint(session_bp)
app.register_blueprint(category_bp)
app.register_blueprint(goal_bp)

@app.route("/")
def home():
    return {"message": "HabitClock backend running"}

if __name__ == "__main__":
    app.run(debug=True)
