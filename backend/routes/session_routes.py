from flask import Blueprint, request, jsonify, session as flask_session
from datetime import datetime
from models import db, Session, Habit
from schemas import SessionSchema

session_bp = Blueprint('session_bp', __name__, url_prefix='/sessions')

session_schema = SessionSchema()
sessions_schema = SessionSchema(many=True)

@session_bp.route('/<int:habit_id>', methods=['GET'])
def get_sessions(habit_id):
    if 'user_id' not in flask_session:
        return {"error": "Unauthorized"}, 401

    habit = Habit.query.filter_by(id=habit_id, user_id=flask_session['user_id']).first_or_404()
    sessions = Session.query.filter_by(habit_id=habit.id, user_id=flask_session['user_id']).all()
    return sessions_schema.dump(sessions), 200

@session_bp.route('/<int:habit_id>/start', methods=['POST'])
def start_session(habit_id):
    if 'user_id' not in flask_session:
        return {"error": "Unauthorized"}, 401

    habit = Habit.query.filter_by(id=habit_id, user_id=flask_session['user_id']).first_or_404()

    active = Session.query.filter_by(
        habit_id=habit.id,
        user_id=flask_session['user_id'],
        end_time=None
    ).first()

    if active:
        return {"error": "Session already running"}, 400

    new_session = Session(
        habit_id=habit.id,
        user_id=flask_session['user_id'],
        start_time=datetime.utcnow(),
        end_time=None,
        duration=None
    )

    db.session.add(new_session)
    db.session.commit()

    return session_schema.dump(new_session), 201

@session_bp.route('/<int:habit_id>/stop', methods=['POST'])
def stop_session(habit_id):
    if 'user_id' not in flask_session:
        return {"error": "Unauthorized"}, 401

    habit = Habit.query.filter_by(id=habit_id, user_id=flask_session['user_id']).first_or_404()

    active = Session.query.filter_by(
        habit_id=habit.id,
        user_id=flask_session['user_id'],
        end_time=None
    ).first()

    if not active:
        return {"error": "No active session"}, 400

    active.end_time = datetime.utcnow()
    active.duration = int((active.end_time - active.start_time).total_seconds())

    db.session.commit()

    return session_schema.dump(active), 200

@session_bp.route('/<int:session_id>', methods=['DELETE'])
def delete_session(session_id):
    if 'user_id' not in flask_session:
        return {"error": "Unauthorized"}, 401

    session_obj = Session.query.filter_by(
        id=session_id,
        user_id=flask_session['user_id']
    ).first_or_404()

    db.session.delete(session_obj)
    db.session.commit()

    return {}, 204

