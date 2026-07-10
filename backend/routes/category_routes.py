from flask import Blueprint, request, jsonify
from models import db, Category
from schemas import CategorySchema

# Blueprint setup
category_bp = Blueprint('category_bp', __name__, url_prefix='/categories')

# Schema instances
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)


@category_bp.route('/', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    result = categories_schema.dump(categories)
    return result, 200

@category_bp.route('/<int:id>', methods=['GET'])
def get_category(id):
    category = Category.query.get_or_404(id)
    result = category_schema.dump(category)
    return result, 200 

@category_bp.route('/', methods=['POST'])
def create_category():
    data = request.get_json()
    validated_data = category_schema.load(data)
    new_category = Category(**validated_data)
    db.session.add(new_category)
    db.session.commit()
    result = category_schema.dump(new_category)
    return result, 201

@category_bp.route('/<int:id>', methods=['PATCH'])
def update_category(id):
    data = request.get_json()
    validated_data = category_schema.load(data, partial=True)
    category = Category.query.get_or_404(id)
    for field, value in validated_data.items():
        setattr(category, field, value)
    db.session.commit()
    return category_schema.dump(category), 200

@category_bp.route('/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    return {}, 204 