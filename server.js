// server.js
import jsonServer from "json-server";
import auth from "json-server-auth";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.db = router.db;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// json-server-auth debe ir antes del router
server.use(auth);

// rutas de la DB
server.use(router);

server.listen(3001, () => {
  console.log("✅ JSON Server corriendo en http://localhost:3001");
});