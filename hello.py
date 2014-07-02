import os
from flask import Flask, render_template, request
from flask.ext.sqlalchemy import SQLAlchemy
import jinja2
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_imageattach.entity import Image, image_attachment
import json


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgres://avodddfdxytrat:yFn8_7fiQEdlhkhPJ0UjsQukCJ@ec2-54-225-135-30.compute-1.amazonaws.com:5432/df09oj774bls87')
db = SQLAlchemy(app)



class Report(db.Model):

    __tablename__ = 'report'

    type_request = db.Column(db.String(10))
    imei = db.Column(db.String, primary_key=True)
    latitude = db.Column(db.String(10))
    longitude = db.Column(db.String(10))
    description = db.Column(db.String(400))
    number = db.Column(db.String(15))
    timestamp = db.Column(db.String(10))
    country = db.Column(db.String(30))
    area = db.Column(db.String(30))
    locality = db.Column(db.String(30))

    def __init__(self, type_request, imei, latitude, longitude, description, number, timestamp, country, area, locality):
        self.type_request = type_request
        self.imei = imei
        self.latitude = latitude
        self.longitude = longitude
        self.description = description
        self.number = number
        self.timestamp = timestamp
        self.country = country
        self.area = area
        self.locality = locality

    def __repr__(self):
        return '<IMEI %r>' % self.imei


class ReportPicture(db.Model, Image):

    user_id = db.Column(db.String, db.ForeignKey('report.imei'), primary_key=True)
    user = db.relationship('Report')
    __tablename__ = 'report_picture'


@app.route('/')
def hello():

    return render_template("index.html")


def get_number_of_reports():
    return 5

@app.route('/upload', methods = ['POST'])
def upload():

    type_request = request.form['Type']

    if type_request == "Internet":

        imei = request.form['IMEI']
        latitude = request.form['Latitude']
        longitude = request.form['Longitude']
        description = request.form['Description']
        number = request.form['Number']
        time = request.form['Time']
        address_json = request.form['Address']
        address = json.loads(address_json)
        country = address["Country"]
        area = address["Administrative Area"]
        locality = address["Locality"]
        # picture_url = request.values['image']
        report = Report(type_request, imei, latitude, longitude, description, number, time, country, area, locality)
        #db.session.add(report)
        #db.session.commit()

    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug = True)
