from flask import Blueprint, request, jsonify, session
from models import db, Category
from schemas import CategorySchema

# Blueprint setup
category_bp = Blueprint('category_bp', __name__, url_prefix='/categories')

# Schema instances
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)


@category_bp.route('/', methods=['GET'])
def get_categories():
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    categories = Category.query.filter(
        (Category.user_id == session['user_id']) |
        (Category.user_id == None)
    ).all()
    return categories_schema.dump(categories), 200


@category_bp.route('/<int:id>', methods=['GET'])
def get_category(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    category = Category.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    result = category_schema.dump(category)
    return result, 200 

@category_bp.route('/', methods=['POST'])
def create_category():
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    data = request.get_json()
    validated_data = category_schema.load(data)
    new_category = Category(**validated_data, user_id=session['user_id'])
    db.session.add(new_category)
    db.session.commit()
    result = category_schema.dump(new_category)
    return result, 201

@category_bp.route('/<int:id>', methods=['PATCH'])
def update_category(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    data = request.get_json()
    validated_data = category_schema.load(data, partial=True)
    category = Category.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    for field, value in validated_data.items():
        setattr(category, field, value)
    db.session.commit()
    return category_schema.dump(category), 200

@category_bp.route('/<int:id>', methods=['DELETE'])
def delete_category(id):
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

    category = Category.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    db.session.delete(category)
    db.session.commit()
    return {}, 204
