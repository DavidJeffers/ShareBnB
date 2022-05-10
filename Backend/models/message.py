from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Message(db.Model):
    """Messages in the system."""

    __tablename__ = 'messages'

    id = db.Column(
        db.Integer,
        nullable=False,
        unique=True,
        primary_key=True,
    )

    to_user = db.Column(
        db.Text,
        nullable=False,
    )

    from_user = db.Column(
        db.Text,
        nullable=False,
    )

    message_text = db.Column(
        db.Text,
        nullable=False,
    )

    timestamp = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
    )
