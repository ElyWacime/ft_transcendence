idr=c99b3e74f771
idr2=qwqw_pong-server
g:
	docker stop $(idr) && docker rm $(idr)&& docker rmi $(idr2)

up:
	docker compose up -d --build
dn:
	docker compose down
rm:
	docker stop $$(docker ps -aq) && docker rm $$(docker ps -aq) && docker rmi $$(docker images -aq)  &&  docker system prune -a --volumes
re: rm up
git:
	sudo git add . && sudo git commit -m "FUpdts" && sudo git push

auth:
	@echo "Completely rebuilding auth container from scratch..."
	docker-compose down -v auth-service
	docker-compose build --no-cache auth-service
	docker-compose up -d auth-service

