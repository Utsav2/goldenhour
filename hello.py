import os
from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
import jinja2

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgres://avodddfdxytrat:yFn8_7fiQEdlhkhPJ0UjsQukCJ@ec2-54-225-135-30.compute-1.amazonaws.com:5432/df09oj774bls87')
db = SQLAlchemy(app)

@app.route('/')
def hello():
    return render_template("index.html", title = 'Home')

if __name__ == "__main__":
    app.run(debug = True)