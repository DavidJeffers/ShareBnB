from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask import g
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

db = SQLAlchemy()

def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)


class User(db.Model):
    """User in the system."""

    __tablename__ = 'users'

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True,
        primary_key=True,
    )

    password = db.Column(
        db.Text,
        nullable=False,
    )

    first_name = db.Column(
        db.Text,
        nullable=False,
    )

    last_name = db.Column(
        db.Text,
        nullable=False,
    )

    bio = db.Column(
        db.Text,
    )

    location = db.Column(
        db.Text,
    )

    @classmethod
    def signup(cls, username, password, first_name, last_name, bio, location):
        """Sign up user.

        Hashes password and adds user to system.
        """

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            password=hashed_pwd,
            first_name=first_name,
            last_name=last_name,
            bio=bio,
            location=location
        )

        db.session.add(user)
        db.session.commit()
        return user

    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`.

        This is a class method (call it on the class, not an individual user.)
        It searches for a user whose password hash matches this password
        and, if it finds such a user, returns that user object.

        If can't find matching user (or if password is wrong), returns False.
        """

        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False

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

    def serialize(self):
        """Serializes listing to a dictionary"""

        return { "id": self.id,
                "to_user": self.to_user,
                "from_user": self.from_user,
                "message_text": self.message_text,
                "timestamp": self.timestamp
                }

    @classmethod
    def add_message(cls, to_user, from_user, message_text):
        """
        """
        message = Message(to_user=to_user,
                            from_user=from_user,
                            message_text=message_text,
                            )

        db.session.add(message)
        db.session.commit()
        return message

class Listing(db.Model):
    """Listings in the system."""

    __tablename__ = 'listings'

    id = db.Column(
        db.Integer,
        nullable=False,
        primary_key=True,
    )

    title = db.Column(
        db.Text,
        nullable=False,
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

    renter = db.Column(
        db.Text,
        db.ForeignKey('users.username', ondelete='CASCADE'),
        nullable=True,
    )


    def serialize(self):
        """Serializes listing to a dictionary"""

        return { "id": self.id,
                "title": self.title,
                "location": self.location,
                "size": self.size,
                "price": self.price,
                "details": self.details,
                "renter": self.renter,
                }

    def serialize_with_photos(self, photos):
        """Serializes listing to a dictionary"""

        return { "id": self.id,
                "title": self.title,
                "location": self.location,
                "size": self.size,
                "price": self.price,
                "details": self.details,
                "renter": self.renter,
                "photos": photos
                }

    @classmethod
    def add_listing(cls, title, location, size, price, details):
        """
        """
        listing = Listing(title=title,
                            location=location,
                            size=size,
                            price=price,
                            details=details
                            )

        db.session.add(listing)
        db.session.commit()
        return listing



class Photo(db.Model):
    """Photos for listings"""

    __tablename__ = 'photo'


    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    listing_id = db.Column(
        db.Integer,
        db.ForeignKey('listings.id', ondelete="cascade"),
    )
    photo_url = db.Column(
        db.Text,
    )

    listing = db.relationship('Listing', backref='photo')

    @classmethod
    def add_photo(cls, listing_id, photo_url):
        """
        """
        photo = Photo(listing_id=listing_id, photo_url=photo_url)

        db.session.add(photo)
        db.session.commit()
        return "Photo was successfully uploaded and added to the database."

    def serialize(self):
        """Serializes photo url to a dictionary"""

        return {
                "id": self.id,
                "listing_id": self.listing_id,
                "photo_url": self.photo_url,

                }