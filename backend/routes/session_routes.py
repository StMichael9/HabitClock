from flask import Blueprint, request, jsonify
from models import db, Session
from schemas import SessionSchema

# Blueprint setup
session_bp = Blueprint('session_bp', __name__, url_prefix='/sessions')

# Schema instances
session_schema = SessionSchema()
sessions_schema = SessionSchema(many=True)

@session_bp.route('/', methods=['GET'])
def get_sessions():
    sessions = Session.query.all()
    result = sessions_schema.dump(sessions)
    return result, 200

@session_bp.route('/<int:id>', methods=['GET'])
def get_session(id):
    session = Session.query.get_or_404(id)
    result = session_schema.dump(session)
    return result, 200

@session_bp.route('/', methods=['POST'])
def create_session():
    data = request.get_json()
    validated_data = session_schema.load(data)
    new_session = Session(**validated_data)
    db.session.add(new_session)
    db.session.commit()
    result = session_schema.dump(new_session)
    return result, 201


@session_bp.route('/<int:id>', methods=['PATCH'])
def update_session(id):
    data = request.get_json()
    validated_data = session_schema.load(data, partial=True)
    session = Session.query.get_or_404(id)
    for field, value in validated_data.items():
        setattr(session, field, value)
    db.session.commit()
    return session_schema.dump(session), 200

@session_bp.route('/<int:id>', methods=['DELETE'])
def delete_session(id):
    session = Session.query.get_or_404(id)
    db.session.delete(session)
    db.session.commit()
    return {}, 204 