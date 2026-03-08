.PHONY: up down rebuild clean

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
	sudo rm ./services/gateway/certs/certificate.crt
	sudo rm ./services/gateway/certs/private.key


rm:
	(docker compose down -v --rmi all --remove-orphans) 2>/dev/null || true

nk:
	docker  system prune -a --volumes -f &&  docker network rm $$(docker network ls -q)

db2: rm
	rm -f services/chat-service/dev.db && rm -f services/auth-service/prisma/db/data.db && rm -rf services/game-service/db/database.sqlite
	
db:
	rm -f services/chat-service/dev.db && rm -f services/auth-service/prisma/db/data.db && rm -rf services/game-service/db/database.sqlite && 	rm ./services/gateway/certs/certificate.crt && rm ./services/gateway/certs/private.key

re:
	docker compose down
	docker compose up --build -d

ps:
	docker compose ps

certs:
	chmod +x generate-certs.sh
	chmod +x get_machine_ip.sh
	./get_machine_ip.sh && ./generate-certs.sh

saad:db
	(docker stop $$(docker ps -qa) &&  docker rm $$(docker ps -qa) &&  docker rmi -f $$(docker images -qa) &&  docker volume rm $$(docker volume ls -q) &&  docker system prune -a --volumes -f &&  docker network rm $$(docker network ls -q)) 2>/dev/null || true