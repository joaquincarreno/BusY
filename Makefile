

start: 
	sudo docker-compose up

frontend!:
	sudo docker compose up frontend

backend!:
	sudo docker compose up backend

backend-terminal:
	sudo docker compose run backend bash -c '\
		python -m pip install -r requirements.txt && \
		python manage.py makemigrations && \
		python manage.py migrate && \
		bash'
	

create-venvs:
	python -m venv venv-backend
	python -m venv venv-notebooks
	./venv-backend/bin/python -m pip install -r ./backend/requirements.txt
	./venv-notebooks/bin/python -m pip install -r ./requirements.txt