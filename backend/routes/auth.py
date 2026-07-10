from flask import Blueprint, request, session
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if user:
        return {"error": "User already exists"}, 422
    
    new_user = User(email=email, password_hash=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id
    return {"id": new_user.id, "email": new_user.email}, 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return {"error": "Invalid email or password"}, 401
    
    session['user_id'] = user.id
    return {"id": user.id, "email": user.email}, 200

@auth_bp.route("/logout", methods=["DELETE"])
def logout():
    session.clear()
    return {}, 200

@auth_bp.route("/check_session", methods=["GET"])
def check_session():
    user_id = session.get("user_id")
    if not user_id:
        return {}, 204
    user = User.query.get(user_id)
    return {"id": user.id, "email": user.email}, 200
