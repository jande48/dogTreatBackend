# dogTreatBackend
This repository is the local server for a raspberry pi dog treat dispenser.  It will recieve web hooks with ngrok, then route to a docker nginx container. Traffic routed to a uwsgi instance of a flask app.  Redis is used as a task manager for dispensing treat via a GPIO board.  
