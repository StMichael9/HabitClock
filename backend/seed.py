from app import app
from models import db, User, Habit, Category, Goal, Session

# Global preset categories (not tied to any user)
preset_categories = [
    "Work",
    "Health",
    "Productivity",
    "Fitness",
    "Learning",
    "Personal"
]

with app.app_context():
    print("Seeding database...")

    # Create preset categories
    for name in preset_categories:
        exists = Category.query.filter_by(name=name, user_id=None).first()
        if not exists:
            db.session.add(Category(name=name, user_id=None))

    db.session.commit()

    print("Preset categories created!")
