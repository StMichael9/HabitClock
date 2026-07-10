from app import app
from models import db, User, Habit, Category, Goal, Session
from werkzeug.security import generate_password_hash

with app.app_context():
    print("Seeding database...")

    # Users
    user1 = User(email="seed1@test.com", password_hash=generate_password_hash("123"))
    user2 = User(email="seed2@test.com", password_hash=generate_password_hash("123"))

    db.session.add_all([user1, user2])
    db.session.commit()

    # Categories
    cat1 = Category(name="Health", user_id=user1.id)
    cat2 = Category(name="Productivity", user_id=user1.id)

    db.session.add_all([cat1, cat2])
    db.session.commit()

    # Habits
    habit1 = Habit(name="Workout", description="Gym at 6pm", user_id=user1.id, category_id=cat1.id)
    habit2 = Habit(name="Read", description="Read 20 pages", user_id=user1.id, category_id=cat2.id)

    db.session.add_all([habit1, habit2])
    db.session.commit()

    # Goals
    goal1 = Goal(habit_id=habit1.id, target_hours=10, user_id=user1.id)
    goal2 = Goal(habit_id=habit2.id, target_hours=5, user_id=user1.id)

    db.session.add_all([goal1, goal2])
    db.session.commit()

    # Sessions
    session1 = Session(habit_id=habit1.id, duration=30, user_id=user1.id)
    session2 = Session(habit_id=habit2.id, duration=45, user_id=user1.id)

    db.session.add_all([session1, session2])
    db.session.commit()

    print("Seeding complete!")
