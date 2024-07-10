COMPOSE = sudo docker compose

build:
	$(COMPOSE) build backend
	$(COMPOSE) build frontend

build-no-cache:
	$(COMPOSE) build frontend --no-cache
	$(COMPOSE) build backend --no-cache
	
start:
	$(COMPOSE) start

stop:
	$(COMPOSE) stop

up: 
	$(COMPOSE) up

up!: 
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
	$(MAKE) start
	$(MAKE) backend-terminal

clean-terminal:
	$(MAKE) up!
	$(MAKE) start-con-terminal

create-venvs:
	python -m venv venv-backend
	python -m venv venv-notebooks
	./venv-backend/bin/python -m pip install -r ./backend/requirements.txt
	./venv-notebooks/bin/python -m pip install -r ./requirements.txt