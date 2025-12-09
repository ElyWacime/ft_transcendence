# Fastify server (port 3000)

Quick start to run the server locally.

1. Change into the `server` folder:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Verify (in another terminal):

```bash
curl http://10.12.7.4:3000/
# or open http://10.12.7.4:3000/ in the browser
```

The server responds with JSON: `{ "message": "Hello from Fastify!" }`.
