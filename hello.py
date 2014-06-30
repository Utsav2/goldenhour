import os
from flask import Flask, render_template
import jinja2

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template("index.html", title = 'Home')

if __name__ == "__main__":
    app.run(debug = True)