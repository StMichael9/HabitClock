from flask import Blueprint, request, jsonify, session
from models import db, Session
from schemas import SessionSchema

# Blueprint setup
session_bp = Blueprint('session_bp', __name__, url_prefix='/sessions')

# Schema instances
session_schema = SessionSchema()
sessions_schema = SessionSchema(many=True)

@session_bp.route('/', methods=['GET'])
def get_sessions():
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    sessions = Session.query.filter_by(user_id=session['user_id']).all()
    result = sessions_schema.dump(sessions)
    return result, 200

@session_bp.route('/<int:id>', methods=['GET'])
def get_session(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    session_obj = Session.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    result = session_schema.dump(session_obj)
    return result, 200

@session_bp.route('/', methods=['POST'])
def create_session():
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    data = request.get_json()
    validated_data = session_schema.load(data)
    new_session = Session(**validated_data, user_id=session['user_id'])
    db.session.add(new_session)
    db.session.commit()
    result = session_schema.dump(new_session)
    return result, 201

@session_bp.route('/<int:id>', methods=['PATCH'])
def update_session(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    data = request.get_json()
    validated_data = session_schema.load(data, partial=True)
    session_obj = Session.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    for field, value in validated_data.items():
        setattr(session_obj, field, value)
    db.session.commit()
    return session_schema.dump(session_obj), 200

@session_bp.route('/<int:id>', methods=['DELETE'])
def delete_session(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    session_obj = Session.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    db.session.delete(session_obj)
    db.session.commit()
    return {}, 204