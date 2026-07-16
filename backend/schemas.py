from marshmallow import Schema, fields

class HabitSchema(Schema):
    id = fields.Int(dump_only=True)
    category_id = fields.Int(allow_none=True)
    name = fields.Str(required=True)
    description = fields.Str()
    isActive = fields.Bool()
    createdAt = fields.DateTime(dump_only=True)
    updatedAt = fields.DateTime(dump_only=True)
    user_id = fields.Int(dump_only=True)
    category = fields.Nested("CategorySchema", dump_only=True)



class SessionSchema(Schema):
    id = fields.Int(dump_only=True)
    habit_id = fields.Int(required=True)
    start_time = fields.DateTime(dump_only=True)
    end_time = fields.DateTime()
    duration = fields.Int()
    user_id = fields.Int(dump_only=True)



class CategorySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    user_id = fields.Int(dump_only=True)



class GoalSchema(Schema):
    id = fields.Int(dump_only=True)
    habit_id = fields.Int(required=True)
    target_hours = fields.Int(required=True)
    deadline = fields.DateTime()
    user_id = fields.Int(dump_only=True)
