import os
from flask import Flask, render_template, request
from flask.ext.sqlalchemy import SQLAlchemy
import jinja2

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgres://avodddfdxytrat:yFn8_7fiQEdlhkhPJ0UjsQukCJ@ec2-54-225-135-30.compute-1.amazonaws.com:5432/df09oj774bls87')
db = SQLAlchemy(app)


@app.route('/')
def hello():
    number_of_reports = get_number_of_reports()
    return render_template("index.html", title = 'Home', number_of_reports = number_of_reports)


def get_number_of_reports():
    return 5

@app.route('/upload', methods = ['POST'])
def upload():
    return 5

class Report(db.Model):
    imei = db.Column(db.String, primary_key=True)
    latitude = db.Column(db.String)
    longitude = db.Column(db.String)
    

    def __init__(self, id):
        self.id = id

    def __repr__(self):
        return '<Name %r>' % self.name



if __name__ == "__main__":
    app.run(debug = True)
