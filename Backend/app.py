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

app = Flask(__name__)
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
def get_listings():
    """ """

    listings = Listing.query.all()
    serialized = [l.serialize() for l in listings]

    return jsonify(listings=serialized)

@app.route('/listings', methods=["POST"])
def add_listing():
    """ """
    files = request.files

    location = request.json["location"]
    size = request.json["size"]
    price = request.json["price"]
    details = request.json["details"]

    listing = Listing.add_listing(location, size, price, details)

    return jsonify(location=listing.location,
                    size=listing.size,
                    price=listing.price,
                    details=listing.details,
                )

@app.route('/listings/<int:listing_id>/upload', methods=["POST"])
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
                image_url = f"https://{os.environ['BUCKET']}.{os.environ['AVAILABILITY_ZONE']}.amazonaws.com/{filename}"
                photo = Photo.add_photo(listing_id, image_url)

            except:
                return jsonify(message="Error! Unsuccessful photo upload.")

            return jsonify(message="Photo was successfully uploaded.")

    return jsonify(message="Error! File must be .png, .jpg, .jpeg, or .gif!")



@app.route('/listings/<int:listing_id>', methods=["GET"])
def get_listing(listing_id):
    # breakpoint()
    listing = Listing.query.get_or_404(listing_id)
    serialized_listing = listing.serialize()

    return jsonify(listing=serialized_listing)

