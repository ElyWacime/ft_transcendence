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
	(docker stop $$(docker ps -qa) && \ docker rm $$(docker ps -qa) && \ docker rmi -f $$(docker images -qa) && \ docker volume rm $$(docker volume ls -q) && \ docker system prune -a --volumes -f && \ docker network rm $$(docker network ls -q)) 2>/dev/null || true

re: rm up


