from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)

    # when a user is deleted, delete all their data
    habits = db.relationship("Habit", backref="user", cascade="all, delete-orphan")
    sessions = db.relationship("Session", backref="user", cascade="all, delete-orphan")
    categories = db.relationship("Category", backref="user", cascade="all, delete-orphan")
    goals = db.relationship("Goal", backref="user", cascade="all, delete-orphan")


class Habit(db.Model):
    __tablename__ = "habit"

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    name = db.Column(db.String(100), nullable=False) 
    description = db.Column(db.Text)
    isActive = db.Column(db.Boolean, nullable=True)
    createdAt = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updatedAt = db.Column(
        db.DateTime, 
        nullable=False, 
        server_default=db.func.now(), 
        onupdate=db.func.now()
    )
    # when a habit is deleted, delete its sessions + goals
    sessions = db.relationship("Session", backref="habit", cascade="all, delete-orphan")
    goals = db.relationship("Goal", backref="habit", cascade="all, delete-orphan")

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Session(db.Model):
    __tablename__ = 'session'

    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    end_time = db.Column(db.DateTime, nullable=True)
    duration = db.Column(db.Integer, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Category(db.Model):
    __tablename__ = 'category'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # when a category is deleted, delete its habits
    habits = db.relationship("Habit", backref='category', cascade="all, delete-orphan")
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Goal(db.Model):
    __tablename__ = 'goal'

    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'), nullable=False)
    target_hours = db.Column(db.Integer, nullable=True)
    deadline = db.Column(db.DateTime, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

