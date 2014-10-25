import os
from flask import Flask, render_template, request, jsonify, send_from_directory 
import jinja2

app = Flask(__name__)

@app.route("/")
def main_page():
	return render_template('index.html')

if __name__ == "__main__":
	port = int(os.environ.get("PORT", 5000))
	app.run(debug=True, host='0.0.0.0', port=port)
    #app.run(debug = True)

