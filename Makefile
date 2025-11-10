up:
	docker compose up -d --build
rm:
	docker stop $$(docker ps -aq) && docker rm $$(docker ps -aq) && docker rmi $$(docker images -aq) && sudo docker system prune -a --volumes
re: rm up
git:
	sudo git add . && sudo git commit -m "Stable" && sudo git push