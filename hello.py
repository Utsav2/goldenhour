import os
from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
import jinja2

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
db = SQLAlchemy(app)

@app.route('/')
def hello():
    return render_template("index.html", title = 'Home')

if __name__ == "__main__":
    app.run(debug = True)