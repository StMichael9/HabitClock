from flask import Blueprint, request, jsonify
from models import db, Habit
from schemas import HabitSchema

# Blueprint setup
habit_bp = Blueprint('habit_bp', __name__, url_prefix='/habits')

# Schema instances
habit_schema = HabitSchema()
habits_schema = HabitSchema(many=True)


@habit_bp.route('/', methods=['GET'])
def get_habits():
    habits = Habit.query.all()
    result = habits_schema.dump(habits)
    return result, 200


@habit_bp.route('/<int:id>', methods=['GET'])
def get_habit(id):
    habit = Habit.query.get_or_404(id)
    result = habit_schema.dump(habit)
    return result, 200


@habit_bp.route('/', methods=['POST'])
def create_habit():
    data = request.get_json()
    validated_data = habit_schema.load(data)
    new_habit = Habit(**validated_data)
    db.session.add(new_habit)
    db.session.commit()

    result = habit_schema.dump(new_habit)
    return result, 201
  

@habit_bp.route('/<int:id>', methods=['PATCH'])
def update_habit(id):
    data = request.get_json()
    validated_data = habit_schema.load(data, partial=True)
    habit = Habit.query.get_or_404(id)
    for field, value in validated_data.items():
        setattr(habit, field, value)
    db.session.commit()
    return habit_schema.dump(habit), 200


@habit_bp.route('/<int:id>', methods=['DELETE'])
def delete_habit(id):
    habit = Habit.query.get_or_404(id)
    db.session.delete(habit)
    db.session.commit()
