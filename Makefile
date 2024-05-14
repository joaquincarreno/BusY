

start: 
	sudo docker-compose up

create-venvs:
	python -m venv venv-backend
	python -m venv venv-notebooks
	./venv-backend/bin/python -m pip install -r ./backend/requirements.txt
	./venv-notebooks/bin/python -m pip install -r ./requirements.txt