.PHONY: help build up down logs clean restart migrate seed

help:
	@echo "SOC Dashboard - Comandos disponíveis:"
	@echo "  make build       - Build das imagens Docker"
	@echo "  make up          - Iniciar containers"
	@echo "  make down        - Parar containers"
	@echo "  make logs        - Ver logs"
	@echo "  make restart     - Reiniciar containers"
	@echo "  make clean       - Limpar volumes e containers"
	@echo "  make migrate     - Executar migrações de banco"
	@echo "  make seed        - Popular banco com dados de exemplo"

DOCKER_COMPOSE ?= docker compose

build:
	$(DOCKER_COMPOSE) build

up:
	$(DOCKER_COMPOSE) up -d
	@echo "Dashboard disponível em: http://localhost"
	@echo "API disponível em: http://localhost/api"

down:
	$(DOCKER_COMPOSE) down

logs:
	$(DOCKER_COMPOSE) logs -f

restart:
	$(DOCKER_COMPOSE) restart

clean:
	$(DOCKER_COMPOSE) down -v
	docker system prune -f

migrate:
	$(DOCKER_COMPOSE) exec backend alembic upgrade head

seed:
	$(DOCKER_COMPOSE) exec backend python -c "from app.scripts.seed import seed_data; seed_data()"
