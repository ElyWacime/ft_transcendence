up:
	docker compose up -d --build
dn:
	docker compose down
rm:
	docker stop $$(docker ps -aq) && docker rm $$(docker ps -aq) && docker rmi $$(docker images -aq)  &&  docker system prune -a --volumes
re: rm up
git:
	sudo git add . && sudo git commit -m "FUpdts" && sudo git push