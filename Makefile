
build:
	sudo docker compose build
	
start:
	sudo docker compose start

up: 
	sudo docker-compose up

frontend!:
	sudo docker compose up frontend

backend!:
	sudo docker compose up backend

frontend?:
	sudo docker compose start frontend

backend?:
	sudo docker compose start backend

backend-terminal:
	sudo docker compose run backend bash -c '\
		python -m pip install -r requirements.txt && \
		python manage.py makemigrations && \
		python manage.py migrate && \
		bash'
	
start-con-terminal:
	$(MAKE) frontend?
	$(MAKE) backend-terminal

create-venvs:
	python -m venv venv-backend
	python -m venv venv-notebooks
	./venv-backend/bin/python -m pip install -r ./backend/requirements.txt
	./venv-notebooks/bin/python -m pip install -r ./requirements.txt