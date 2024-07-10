COMPOSE = sudo docker compose

build:
	$(COMPOSE) build
	
start:
	$(COMPOSE) start

stop:
	$(COMPOSE) stop

up: 
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

frontend!:
	$(COMPOSE) up frontend -d

backend!:
	$(COMPOSE) up backend -d

start-frontend:
	$(COMPOSE) start frontend

start-backend:
	$(COMPOSE) start backend

backend-terminal:
	sudo docker exec -it busy-backend-1 zsh
	
start-con-terminal:
	$(MAKE) start-frontend
	$(MAKE) backend-terminal

clean-terminal:
	$(COMPOSE) build --no-cache
	$(MAKE) start-con-terminal

create-venvs:
	python -m venv venv-backend
	python -m venv venv-notebooks
	./venv-backend/bin/python -m pip install -r ./backend/requirements.txt
	./venv-notebooks/bin/python -m pip install -r ./requirements.txt