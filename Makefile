.PHONY: up down rebuild clean

up:
	docker-compose up -d --build

down:
	docker-compose down

rebuild: clean up

clean:
	docker-compose down -v
	rm -f services/chat-service/dev.db
	rm -f services/auth-service/prisma/db/data.db
	docker system prune -f

rm:
	docker stop $$(docker ps -aq) && docker rm $$(docker ps -aq) && docker rmi $$(docker images -aq)  &&  docker system prune -a --volumes
re: rm up