from email import message
import json
import boto3
from flask import Flask, request, jsonify, g
from models import db, connect_db, Message, User, Listing, UserListing
from flask_jwt_extended import create_access_token, JWTManager

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://davidjeffers:1234@localhost:5432/sharebnb' # added: davidjeffers:1234@localhost:5432
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config["JWT_SECRET_KEY"] = "super-secret"

connect_db(app)
jwt = JWTManager(app)
# all routes go here

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
    s3_client = boto3.client(
    "s3",
    "us-east-2",
    aws_access_key_id="AKIAV7FFQTI74KQLMFND",
    aws_secret_access_key="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",
    )
    
    try: 
        response = s3_client.upload_file(file, "listing-photos-sharebnb", "file")
        return jsonify(message=response)
    except:
        return jsonify(error="error")

    

@app.route('/listings/<int:listing_id>', methods=["GET"])
def get_listing(listing_id):
    # breakpoint()
    listing = Listing.query.get_or_404(listing_id)
    serialized_listing = listing.serialize()

    return jsonify(listing=serialized_listing)

