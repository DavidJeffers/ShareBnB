from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class UserListing(db.Model):
    """Listings in the system."""

    __tablename__ = 'user_listings'

    user_id = db.Column(
        db.Text,
        db.ForeignKey('users.username', ondelete="cascade"),
        primary_key=True,
    )

    listing_id = db.Column(
        db.Integer,
        db.ForeignKey('listings.id', ondelete="cascade"),
        primary_key=True,
    )