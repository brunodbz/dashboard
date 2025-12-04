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

build:
	docker-compose build

up:
	docker-compose up -d
	@echo "Dashboard disponível em: http://localhost"
	@echo "API disponível em: http://localhost/api"

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

clean:
	docker-compose down -v
	docker system prune -f

migrate:
	docker-compose exec backend alembic upgrade head

seed:
	docker-compose exec backend python -c "from app.scripts.seed import seed_data; seed_data()"
