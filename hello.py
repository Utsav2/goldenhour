import os
from flask import Flask, render_template, request, jsonify, send_from_directory 
import jinja2
import json
import hashlib
from werkzeug import secure_filename
from firebase import firebase


app = Flask(__name__)

@app.route("/")
def main_page():
	return render_template('index.html')
	#firebase = firebase.FirebaseApplication('https://goldenhour.firebaseio.com', None)
	#result = firebase.post('/users', dhruv.diddi, {'print': 'pretty'}, {'X_FANCY_HEADER': 'VERY FANCY'})
	#print result
	
if __name__ == "__main__":
    app.run(debug = True)

