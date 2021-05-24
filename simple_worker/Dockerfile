
FROM arm32v7/python:3.6-slim-stretch
RUN pip install --upgrade pip

RUN pip3 install --upgrade setuptools 
RUN apt-get update && apt-get -y install gcc
RUN apt-get update && apt-get -y install build-essential
RUN pip3 install rpi.gpio --upgrade

COPY requirements.txt /
RUN pip3 install -r /requirements.txt

ADD . /simple_worker
WORKDIR /simple_worker

ENTRYPOINT celery -A tasks worker --loglevel=info
