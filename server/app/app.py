from flask import Flask, jsonify, json, request
from celery import Celery
import sqlite3, os
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
#run_with_ngrok(app)
simple_app = Celery('simple_worker', broker='redis://redis:6379/0', backend='redis://redis:6379/0')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jsonObject.sqlite3.db'
db = SQLAlchemy(app)
# location of localhost:3000
# http://6f3e6bd3bc68.ngrok.io 

class jsonObject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jsonData = db.Column(db.Text, nullable=False)
    
    def __init__(self,jsonData):
      self.jsonData = jsonData

@app.route('/', methods=['POST','GET'])
def postSmeeWebHook():
  payload = request.get_json()
  print(payload)
  return jsonify({'1':'1'})

@app.route('/api', methods=['GET'])
def index():
  lastDBentry = json.loads(jsonObject.query.order_by(jsonObject.id.desc()).first().jsonData)
  return jsonify(lastDBentry)

@app.route('/api/dispenseTreatRoute', methods=['GET'])
def dispenseTreatRoute():
  #app.logger.info("Invoking Method ")
  # queue name in task folder.function name
  r = simple_app.send_task('tasks.dispenseTreatCelery')
  app.logger.info(r.backend)
  return jsonify({
    "taskId": "0"
  })

@app.route('/api/simple_start_task', methods=['GET'])
def call_method():
    app.logger.info("Invoking Method ")
    #                        queue name in task folder.function name
    r = simple_app.send_task('tasks.longtime_add', kwargs={'x': 1, 'y': 2})
    app.logger.info(r.backend)
    return jsonify(r.id)


@app.route('/api/simple_task_status/<task_id>')
def get_status(task_id):
    status = simple_app.AsyncResult(task_id, app=simple_app)
    print("Invoking Method ")
    return "Status of the Task " + str(status.state)


@app.route('/api/simple_task_result/<task_id>')
def task_result(task_id):
    result = simple_app.AsyncResult(task_id).result
    return "Result of the Task " + str(result)


if __name__=="__main__":
    app.run()