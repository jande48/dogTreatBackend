FROM python:3

WORKDIR /app

ADD . /app
# ENV FLASK_APP=app.py

# ENV FLASK_ENV=development

# COPY ./requirements.txt .

RUN pip install -r requirements.txt

CMD ["uwsgi","app.ini"]
#EXPOSE 5000

#COPY . . 
#ENTRYPOINT [ "flask" ]
#CMD ["run", "--host=0.0.0.0", "--port=5000"]

# CMD gunicorn --workers 4 \
#  --threads 2 \
#  --bind 0.0.0.0:5000 \
#  --log-level DEBUG \
#  app:app

#ENTRYPOINT ["gunicorn","app:app","-w","4","--threads","2","-b","0.0.0.0:5000"]
#CMD ["python","app.py"]
#gunicorn --chdir app app:app -w 2 --threads 2 -b 0.0.0.0:5000