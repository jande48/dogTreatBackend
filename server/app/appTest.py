from flask import Flask, jsonify, json, request
from celery import Celery
import sqlite3, os
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jsonObject.sqlite3.db'
db = SQLAlchemy(app)

simple_app = Celery('simple_worker', broker='redis://redis:6379/0', backend='redis://redis:6379/0')

# location of localhost:3000
# http://c685066d3ed8.ngrok.io

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
  return jsonify({
    "channel": "The Show",
    "tutorial": "React, Flask and Docker Jacob"
  })

@app.route('/api/dispenseTreatRoute', methods=['GET'])
def dispenseTreatRoute():
  lastDBentry = json.loads(jsonObject.query.order_by(jsonObject.id.desc()).first().jsonData)
  newVideoPickle = lastDBentry['video']
  videoNumber = int(newVideoPickle["videoNumber"])
  videoNumber += 1
  newVideoPickle["videoNumber"] = videoNumber
  videoPathForMP4Convert = '../videos/Tedi'+str(videoNumber)

  videoNameAWS = 'Tedi'+str(videoNumber)+'.mp4'
  now = datetime.now()
  nowTimestamp = int(datetime.timestamp(now))
  newVideoPickle["videoPaths"].append({"path":(videoPathForMP4Convert+".mp4"),"date":nowTimestamp,"videoNumber":videoNumber,"videoNameAWS":videoNameAWS})

  lastDBentry['video']=newVideoPickle
  jsonobject = jsonObject(jsonData=json.dumps(lastDBentry))
  db.session.add(jsonobject)
  db.session.commit()

  print('we got here')

  # self.camera.start_preview()
  # self.camera.start_recording(newVideoPath)
  # sleep(5)
  # self.camera.stop_recording()
  # self.camera.stop_preview()
  # command = shlex.split("MP4Box -add {f}.h264 {f}.mp4".format(f=videoPathForMP4Convert))
  # output = subprocess.check_output(command, stderr=subprocess.STDOUT)
  # os.remove(videoPathForMP4Convert+".h264")

  # my_config = Config(region_name = 'us-east-1')

  # client = boto3.client(
  #     's3',
  #     aws_access_key_id=self.access,
  #     aws_secret_access_key=self.secret,
  #     config=my_config
  # )

  # reponseForUpload = client.upload_file(videoPathForMP4ConvertWithMP4, 'tedi-video-bucket', videoNameAWS)

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