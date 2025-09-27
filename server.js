// server.js
import jsonServer from "json-server";
import auth from "json-server-auth";
import jwt from "jsonwebtoken";

const app = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

app.db = router.db;

app.use(middlewares);
app.use(auth);
app.use(router);

// Middleware para validar token
app.use((req, res, next) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "secret123"); // misma secret
      req.user = decoded;
    } catch (err) {
      return res.status(401).json({ message: "Token expirado o inválido" });
    }
  }
  next();
});

app.listen(3001, () => {
  console.log("✅ JSON Server corriendo en http://localhost:3001");
});
