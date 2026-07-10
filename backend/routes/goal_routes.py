from flask import Blueprint, request, jsonify, session
from models import db, Goal
from schemas import GoalSchema

# Blueprint setup
goal_bp = Blueprint('goal_bp', __name__, url_prefix='/goals')

# Schema instances
goal_schema = GoalSchema()
goals_schema = GoalSchema(many=True)

@goal_bp.route('/', methods=['GET'])
def get_goals():
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    goals = Goal.query.filter_by(user_id=session['user_id']).all()
    result = goals_schema.dump(goals)
    return result, 200

@goal_bp.route('/<int:id>', methods=['GET'])
def get_goal(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    goal = Goal.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    result = goal_schema.dump(goal)
    return result, 200

@goal_bp.route('/', methods=['POST'])
def create_goal():
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    data = request.get_json()
    validated_data = goal_schema.load(data)
    new_goal = Goal(**validated_data, user_id=session['user_id'])
    db.session.add(new_goal)
    db.session.commit()
    result = goal_schema.dump(new_goal)
    return result, 201

@goal_bp.route('/<int:id>', methods=['PATCH'])
def update_goal(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    data = request.get_json()
    validated_data = goal_schema.load(data, partial=True)
    goal = Goal.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    for field, value in validated_data.items():
        setattr(goal, field, value)
    db.session.commit()
    return goal_schema.dump(goal), 200

@goal_bp.route('/<int:id>', methods=['DELETE'])
def delete_goal(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    goal = Goal.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    db.session.delete(goal)
    db.session.commit()
    return {}, 204
