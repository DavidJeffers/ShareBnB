from email import message
import boto3
import os
import uuid
import logging
from flask import Flask, request, jsonify, g
from models import db, connect_db, Message, User, Listing, UserListing, Photo
from flask_jwt_extended import create_access_token, JWTManager
from flask_uuid import FlaskUUID
from botocore.exceptions import ClientError
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


flask_uuid = FlaskUUID()
flask_uuid.init_app(app)

database_url = os.environ['DATABASE_URL']
database_url = database_url.replace('postgres://', 'postgresql://')

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config["JWT_SECRET_KEY"] = os.environ['JWT_SECRET_KEY']

connect_db(app)
jwt = JWTManager(app)

VALID_EXTENSIONS = ("jpg", "jpeg", "gif", "png")

@app.route('/register', methods=["POST"])
@cross_origin()
def register():
    """"""
    username = request.json["username"]
    password = request.json["password"]
    first_name = request.json["first_name"]
    last_name = request.json["last_name"]
    bio = request.json["bio"]
    location = request.json["location"]

    user = User.signup(username, password, first_name, last_name, bio, location)
    access_token = create_access_token(identity=username)

    return jsonify(access_token=access_token, username=user.username, first_name=user.first_name, last_name=user.last_name, bio=user.bio, location=user.location)

@app.route('/login', methods=["POST"])
@cross_origin()
def login():
    """ """
    username = request.json["username"]
    password = request.json["password"]

    user = User.authenticate(username, password)
    if user is False:
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token, username=user.username, first_name=user.first_name, last_name=user.last_name, bio=user.bio, location=user.location)

# @app.route('/users/:username', methods=["GET"])
# def get_user():
#     """ """

@app.route('/listings', methods=["GET"])
@cross_origin()
def get_listings():
    """ """

    listings = Listing.query.all()
    serialized = [l.serialize() for l in listings]

    photos = []
    for listing in listings:
        photos = Photo.query.filter_by(listing_id = listing.id)

    photo = [p.serialize() for p in photos]

    return jsonify(listings=serialized, photos=photo)

@app.route('/listings', methods=["POST"])
@cross_origin()
def add_listing():
    """ """

    title = request.json["title"]
    location = request.json["location"]
    size = request.json["size"]
    price = request.json["price"]
    details = request.json["details"]

    listing = Listing.add_listing(title, location, size, price, details)

    return jsonify(title=listing.title,
                    location=listing.location,
                    size=listing.size,
                    price=listing.price,
                    details=listing.details,
                )

@app.route('/listings/<int:listing_id>/upload', methods=["POST"])
@cross_origin()
def add_file(listing_id):
    """ """
    file = request.files['file']
    # print("listingId", type(listing_id))

    for extension in VALID_EXTENSIONS:
        if extension in file.mimetype:
            filename = str(uuid.uuid4()) + "_.jpg" # appends uuid for unique filename
            s3_client = boto3.client(
                            "s3",
                            aws_access_key_id=os.environ['AWS_ACCESS_KEY'],
                            aws_secret_access_key=os.environ['AWS_SECRET_KEY'],
                        )

            try:
                response = s3_client.upload_fileobj(file, os.environ['BUCKET'], filename, ExtraArgs={
                    "ContentType": "image/jpeg",
                })
                image_url = f"https://{os.environ['BUCKET']}.s3.{os.environ['AVAILABILITY_ZONE']}.amazonaws.com/{filename}"
                photo = Photo.add_photo(listing_id, image_url)

            except:
                return jsonify(message="Error! Unsuccessful photo upload.")

            return jsonify(message="Photo was successfully uploaded.")

    return jsonify(message="Error! File must be .png, .jpg, .jpeg, or .gif!")



@app.route('/listings/<int:listing_id>', methods=["GET"])
@cross_origin()
def get_listing(listing_id):
    # breakpoint()
    listing = Listing.query.get_or_404(listing_id)
    serialized_listing = listing.serialize()
    photos = Photo.query.filter_by(listing_id=listing_id).all()
    serialized_photos = []
    for photo in photos:
        serialized_photos.append(photo.serialize())


    return jsonify(listing=serialized_listing, photos=serialized_photos)

@app.route('/listings/<int:listing_id>/rent', methods=["PATCH"])
@cross_origin()
def rent_listing(listing_id):
    username = request.json['username']
    try:
        listing = Listing.query.get_or_404(listing_id)
        if listing.renter != None:
            return jsonify(message="listing not available")
        listing.renter = username

        db.session.commit()
    except:
        return jsonify(message="listing not available")
    return jsonify(message="listing booked")

@app.route('/listings/<int:listing_id>/cancel', methods=["PATCH"])
@cross_origin()
def cancel_listing(listing_id):
    username = request.json['username']
    try:
        listing = Listing.query.get_or_404(listing_id)
        print("listing renter ================", listing.renter)
        if listing.renter != username:
            return jsonify(message="listing is booked by another user")
        listing.renter = None

        db.session.commit()
    except:
        return jsonify(message="listing not available")
    return jsonify(message="listing canceled")

@app.route('/messages/sent', methods=["GET"])
@cross_origin()
def get_messages():
    """ """
    username = request.json['username']

    messages = Message.query.filter_by(from_user=username).all()
    serialized = [m.serialize() for m in messages]

    return jsonify(messages=serialized)

@app.route('/messages/received', methods=["GET"])
@cross_origin()
def get_received_messages():
    """ """
    username = request.json['username']

    messages = Message.query.filter_by(to_user=username).all()
    serialized = [m.serialize() for m in messages]

    return jsonify(messages=serialized)

@app.route('/messages/send', methods=["POST"])
@cross_origin()
def send_message():
    """ """
    to_user = request.json['to_user']
    from_user = request.json['from_user']
    text = request.json['text']

    Message.add_message(to_user=to_user,
                            from_user=from_user,
                            message_text=text)

    return jsonify(messages=f"Message sent to {to_user}!")