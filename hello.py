import os
from flask import Flask
import jinja2

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template("index.html", title = 'Home')