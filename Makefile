.PHONY: up down rebuild clean certs ip use-ip

up: certs
	docker-compose up -d --build

certs:
	bash ./scripts/generate-dev-cert.sh

ip:
	@ip route get 1.1.1.1 | awk '{for (i=1; i<=NF; i++) if ($$i == "src") {print $$(i+1); exit}}'

use-ip:
	bash ./scripts/use-machine-ip.sh

down:
	docker-compose down

rebuild: clean up

clean:
	docker-compose down -v
# 	rm -f services/chat-service/dev.db
# 	rm -f services/auth-service/prisma/db/data.db
# 	rm -f services/game-service/db/database.sqlite
# 	docker system prune -f
	
rm:
	(docker compose down -v --rmi all --remove-orphans) 2>/dev/null || true

nk:
	docker  system prune -a --volumes -f &&  docker network rm $$(docker network ls -q)

db2: rm
	rm -f services/chat-service/dev.db && rm -f services/auth-service/prisma/db/data.db && rm -rf services/game-service/db/database.sqlite
	
db:
	rm -f services/chat-service/dev.db && rm -f services/auth-service/prisma/db/data.db && rm -rf services/game-service/db/database.sqlite
re: rm up


