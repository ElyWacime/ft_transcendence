
up: certs
	docker-compose up -d --build

down:
	docker-compose down

rebuild: fclean certs up

clean:
	docker-compose down -v

fclean: clean
	sudo rm -f services/chat-service/dev.db
	sudo rm -f services/auth-service/prisma/db/data.db
	sudo rm -f services/game-service/db/database.sqlite
	sudo rm -f ./services/gateway/certs/certificate.crt
	sudo rm -f ./services/gateway/certs/private.key

re:
	docker compose down
	docker compose up --build -d

ps:
	docker compose ps

certs:
	chmod +x ./scripts/generate-certs.sh
	chmod +x ./scripts/get_machine_ip.sh
	chmod +x ./scripts/generate-jwt-secrets.sh
	./scripts/generate-jwt-secrets.sh && ./scripts/get_machine_ip.sh && ./scripts/generate-certs.sh

.PHONY: up down rebuild clean
