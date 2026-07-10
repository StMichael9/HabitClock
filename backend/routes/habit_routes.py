from flask import Blueprint, request, jsonify, session
from models import db, Habit
from schemas import HabitSchema

# Blueprint setup
habit_bp = Blueprint('habit_bp', __name__, url_prefix='/habits')

# Schema instances
habit_schema = HabitSchema()
habits_schema = HabitSchema(many=True)


@habit_bp.route('/', methods=['GET'])
def get_habits():
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    habits = Habit.query.filter_by(user_id=session['user_id']).all()
    result = habits_schema.dump(habits)
    return result, 200


@habit_bp.route('/<int:id>', methods=['GET'])
def get_habit(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    habit = Habit.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    result = habit_schema.dump(habit)
    return result, 200


@habit_bp.route('/', methods=['POST'])
def create_habit():
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    data = request.get_json()
    validated_data = habit_schema.load(data)
    new_habit = Habit(**validated_data, user_id=session['user_id'])
    db.session.add(new_habit)
    db.session.commit()

    result = habit_schema.dump(new_habit)
    return result, 201
  

@habit_bp.route('/<int:id>', methods=['PATCH'])
def update_habit(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    data = request.get_json()
    validated_data = habit_schema.load(data, partial=True)
    habit = Habit.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    for field, value in validated_data.items():
        setattr(habit, field, value)
    db.session.commit()
    return habit_schema.dump(habit), 200


@habit_bp.route('/<int:id>', methods=['DELETE'])
def delete_habit(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    habit = Habit.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    db.session.delete(habit)
    db.session.commit()
    return {}, 204
