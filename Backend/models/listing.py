from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Listing(db.Model):
    """Listings in the system."""

    __tablename__ = 'listings'

    id = db.Column(
        db.Integer,
        nullable=False,
        unique=True,
        primary_key=True,
    )

    location = db.Column(
        db.Text,
        nullable=False,
    )

    size = db.Column(
        db.Text,
        nullable=False,
    )

    price = db.Column(
        db.Numeric,
        nullable=False,
    )

    details = db.Column(
        db.Text,
        nullable=False,

    )

    photos = db.Column(
        db.Text,
    )

    renter = db.Column(
        db.Text,
        db.ForeignKey('users.username', ondelete='CASCADE'),
        default=NULL
    )
