up: certs
	docker-compose up -d --build

down:
	docker-compose down

rebuild: fclean up

clean:
	docker-compose down -v

fclean: clean
	rm -f services/chat-service/db/dev.db
	rm -f services/auth-service/prisma/db/data.db
	rm -f services/game-service/db/database.sqlite
	rm -f ./services/gateway/certs/certificate.crt
	rm -f ./services/gateway/certs/private.key
	rm -f ./services/.env
	rm -f ./services/game-service/.env
	rm -f ./services/chat-service/.env

re:
	docker compose down
	docker compose up --build -d

ps:
	docker compose ps

certs:
	chmod +x ./scripts/*.sh
	./scripts/generate_env.sh
	./scripts/generate-jwt-secrets.sh
	./scripts/get_machine_ip.sh
	./scripts/generate-certs.sh

.PHONY: up down rebuild clean fclean re ps certs