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
def display_submit_register():
    """"""
    username = request.json["username"]
    password = request.json["password"]
    first_name = request.json["first_name"]
    last_name = request.json["last_name"] 
    bio = request.json["bio"] 
    location = request.json["location"] 

    user = User.signup(username, password, first_name, last_name, bio, location)
    access_token = create_access_token(identity=username)

    return jsonify(access_token=access_token)
    