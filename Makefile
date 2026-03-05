.PHONY: up down rebuild clean

up:
	docker-compose up -d --build

down:
	docker-compose down

rebuild: clean up

clean:
	docker-compose down -v

fclean: clean
	sudo rm -f services/chat-service/dev.db
	sudo rm -f services/auth-service/prisma/db/data.db
	sudo rm -f services/game-service/db/database.sqlite

rm:
	(docker compose down -v --rmi all --remove-orphans) 2>/dev/null || true

nk:
	docker  system prune -a --volumes -f &&  docker network rm $$(docker network ls -q)

db2: rm
	rm -f services/chat-service/dev.db && rm -f services/auth-service/prisma/db/data.db && rm -rf services/game-service/db/database.sqlite
	
db:
	rm -f services/chat-service/dev.db && rm -f services/auth-service/prisma/db/data.db && rm -rf services/game-service/db/database.sqlite
re: fclean up

ps:
	docker compose ps

certs:
	chmod +x generate-certs.sh
	./generate-certs.sh
